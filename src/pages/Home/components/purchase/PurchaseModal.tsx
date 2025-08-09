import { useState, useEffect, useCallback } from "react";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { AxiosError } from "axios";

import { createTicket } from "../../../../api/ticket";
import { createOrder } from "../../../../api/order";
import type { OrderData } from "../../../../api/order";
import { createPaymentPreference, processBrickPayment } from "../../../../api/payments";
import { getOrderById } from "../../../../api/order";

import { usePurchaseForm } from "./usePurchaseForm";
import { PurchaseForm } from "./PurchaseForm";
import { PaymentSummary } from "./PaymentSummary";
import { MercadoPagoPaymentBrick } from "./MercadoPagoPaymentBrick";

interface PurchaseModalProps {
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
    ticketPrice: number;
    onClose: () => void;
    userId?: string;
}

// **IMPORTANTE:** Public Key de Mercado Pago (SANDBOX/PRUEBA)
const MERCADO_PAGO_PUBLIC_KEY = "TEST-093739c7-8e98-41f4-ba7e-ab972b1f88eb";

export default function PurchaseModal({
    isOpen,
    eventId,
    eventTitle,
    ticketPrice,
    onClose,
    userId,
}: PurchaseModalProps) {
    const {
        buyerName, buyerLastName, buyerEmail, buyerPhone, buyerDni, quantity,
        setQuantity, fieldErrors, handleInputChange, validateAllFields, resetForm,
    } = usePurchaseForm();

    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [checkingPayment, setCheckingPayment] = useState(false);

    const checkPaymentStatusManually = useCallback(async () => {
        if (!orderData) return;
        
        setCheckingPayment(true);
        try {
            const updatedOrder = await getOrderById(orderData.id);
            console.log('Verificación manual - Estado de la orden:', updatedOrder);

            if (updatedOrder.status === 'PAID') {
                setCheckingPayment(false);
                setError(null);
                setStep('success');
            } else if (updatedOrder.status === 'CANCELLED') {
                setCheckingPayment(false);
                setError('El pago fue cancelado o rechazado.');
            } else {
                setCheckingPayment(false);
                setError(`Estado actual: ${updatedOrder.status}. Si ya pagaste, espera unos minutos o contacta soporte.`);
            }
        } catch (err) {
            console.error('Error en verificación manual:', err);
            setCheckingPayment(false);
            setError('Error al verificar el estado. Inténtalo nuevamente.');
        }
    }, [orderData, setCheckingPayment, setError, setStep]);

    const handleClose = useCallback(() => {
        resetForm();
        setStep('form');
        setError(null);
        setPreferenceId(null);
        setOrderData(null);
        onClose();
    }, [resetForm, onClose]);

    const handleFormSubmit = async () => {
        if (!validateAllFields() || quantity < 1) {
            setError("Por favor corrige los errores y asegúrate de seleccionar al menos una entrada.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const ticketIds: number[] = [];
            for (let i = 0; i < quantity; i++) {
                const newTicket = await createTicket({
                    eventId,
                    buyerName,
                    buyerLastName,
                    buyerEmail,
                    buyerPhone: buyerPhone || null,
                    buyerDni,
                });
                ticketIds.push(newTicket.id);
            }

            const order = await createOrder({
                userId: userId || null,
                ticketIds: ticketIds,
            });
            setOrderData(order);

            const { preferenceId: newPreferenceId } = await createPaymentPreference({
                orderId: order.id,
                amount: (ticketPrice * quantity) + (ticketPrice * quantity * 0.1),
                buyerName: buyerName,
                buyerLastName: buyerLastName,
                buyerEmail: buyerEmail,
                buyerPhone: buyerPhone || undefined,
                buyerDni: buyerDni,
            });

            setPreferenceId(newPreferenceId);
            setStep('payment');
        } catch (e: unknown) {
            console.error("Error en el proceso de compra (creación de tickets/orden/preferencia):", e);
            if (e instanceof AxiosError) {
                const backendMessage = e.response?.data?.message;
                setError(backendMessage || "Error al procesar la compra. Intenta nuevamente.");
            } else {
                setError("Ocurrió un error inesperado. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBrickReady = () => {
        console.log("Payment Brick listo para interactuar.");
    };

    interface BrickFormData {
        paymentType: string;
        selectedPaymentMethod: string;
        formData: {
            token: string;
            payment_method_id: string;
            issuer_id: string;
            installments: number;
            transaction_amount: number;
            payer: {
                email: string;
                identification: {
                    type: string;
                    number: string;
                };
            };
        } | null;
    }

    const handleBrickSubmit = async (formData: unknown) => {
        setLoading(true);
        setError(null);

        try {
            if (!orderData) throw new Error("No hay una orden generada.");

            // Type guard or cast to BrickFormData
            const data = formData as BrickFormData;

            console.log("Datos del formulario de Brick:", data);

            // Manejar MercadoPago Wallet (formData es null)
            if (data.paymentType === 'wallet_purchase' && !data.formData) {
                // Para wallet, usar la preferencia directamente
                window.open(`https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`, '_blank');
                setCheckingPayment(true);
                setError("Completa el pago en la ventana de MercadoPago que se abrió. Verificando estado...");

                // Función para verificar estado
                const checkPaymentStatus = async () => {
                    try {
                        const updatedOrder = await getOrderById(orderData.id);
                        console.log('Estado actual de la orden:', updatedOrder);

                        if (updatedOrder.status === 'PAID') {
                            setCheckingPayment(false);
                            setError(null);
                            setStep('success');
                            return true;
                        } else if (updatedOrder.status === 'CANCELLED') {
                            setCheckingPayment(false);
                            setError('El pago fue cancelado o rechazado.');
                            return true;
                        }
                        return false;
                    } catch (err) {
                        console.error('Error verificando estado del pago:', err);
                        return false;
                    }
                };

                // Verificar inmediatamente
                const completed = await checkPaymentStatus();
                if (completed) return;

                // Verificar cada 5 segundos
                const checkInterval = setInterval(async () => {
                    const completed = await checkPaymentStatus();
                    if (completed) {
                        clearInterval(checkInterval);
                    }
                }, 5000);

                // Limpiar intervalo después de 10 minutos
                setTimeout(() => {
                    clearInterval(checkInterval);
                    setCheckingPayment(false);
                    setError('Tiempo de verificación agotado. Verifica manualmente el estado del pago.');
                }, 600000);

                return;
            }

            // Para tarjetas (formData existe)
            if (!data.formData) {
                throw new Error("Datos de pago no disponibles");
            }

            const result = await processBrickPayment({
                orderId: orderData.id,
                token: data.formData.token,
                paymentMethodId: data.formData.payment_method_id,
                issuerId: data.formData.issuer_id,
                installments: data.formData.installments,
                transactionAmount: totalAmount,
                description: `Compra de entradas para ${eventTitle}`,
                payer: {
                    email: data.formData.payer?.email || buyerEmail,
                    identification: data.formData.payer?.identification
                        ? {
                            type: data.formData.payer.identification.type,
                            number: data.formData.payer.identification.number,
                        }
                        : {
                            type: "DNI",
                            number: buyerDni,
                        },
                },
            });

            if (result.status === "approved") {
                setStep("success");
            } else {
                setError("El pago fue rechazado o falló. Intenta nuevamente.");
            }
        } catch (e) {
            console.error("Error al procesar pago desde el Brick:", e);
            setError("Error al procesar el pago. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleBrickError = (error: unknown) => {
        console.error("Error en el Payment Brick:", error);
        setError("Hubo un error con el formulario de pago. Por favor, inténtalo de nuevo.");
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleClose]);

    // Detectar retorno de MercadoPago
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('collection_status');
        const externalReference = urlParams.get('external_reference');
        
        if (paymentStatus && externalReference && orderData?.id === externalReference) {
            if (paymentStatus === 'approved') {
                setStep('success');
                setCheckingPayment(false);
                setError(null);
            } else if (paymentStatus === 'rejected') {
                setError('El pago fue rechazado.');
                setCheckingPayment(false);
            } else {
                checkPaymentStatusManually();
            }
            
            // Limpiar URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [orderData, checkPaymentStatusManually]);

    if (!isOpen) return null;

    const totalAmount = (ticketPrice * quantity) + (ticketPrice * quantity * 0.1);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Compra de Entradas</h2>
                            <p className="text-gray-600 text-sm mt-1">de {eventTitle}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {step === 'form' && (
                        <>
                            <PurchaseForm
                                buyerName={buyerName}
                                buyerLastName={buyerLastName}
                                buyerEmail={buyerEmail}
                                buyerPhone={buyerPhone}
                                buyerDni={buyerDni}
                                quantity={quantity}
                                ticketPrice={ticketPrice}
                                fieldErrors={fieldErrors}
                                handleInputChange={handleInputChange}
                                setQuantity={setQuantity}
                                error={error}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        'Continuar al pago'
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'payment' && (
                        <>
                            {orderData && (
                                <PaymentSummary
                                    orderData={orderData}
                                    buyerName={buyerName}
                                    buyerLastName={buyerLastName}
                                    buyerEmail={buyerEmail}
                                    buyerPhone={buyerPhone}
                                    buyerDni={buyerDni}
                                    quantity={quantity}
                                    onClose={() => setStep('form')}
                                />
                            )}
                            <div className="text-center">
                                <h3 className="lg:text-lg font-semibold mb-2">Completa tu pago</h3>
                                <p className="text-gray-600 text-sm">
                                    Ingresa los datos de tu tarjeta o elige otro medio de pago.
                                </p>
                            </div>

                            {error && (
                                <div className={`border rounded-lg p-3 mb-4 ${checkingPayment
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}>
                                    <p className={`text-sm flex items-center ${checkingPayment ? 'text-blue-600' : 'text-red-600'
                                        }`}>
                                        {checkingPayment ? (
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                        ) : (
                                            <AlertCircle size={16} className="mr-2" />
                                        )}
                                        {error}
                                    </p>
                                </div>
                            )}

                            {preferenceId && (
                                <MercadoPagoPaymentBrick
                                    publicKey={MERCADO_PAGO_PUBLIC_KEY}
                                    preferenceId={preferenceId}
                                    onReady={handleBrickReady}
                                    onSubmit={handleBrickSubmit}
                                    onError={handleBrickError}
                                    amount={totalAmount}
                                    email={buyerEmail}
                                    dni={buyerDni}
                                />
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Cancelar Compra
                                </button>
                                {checkingPayment && (
                                    <button
                                        onClick={checkPaymentStatusManually}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            'Verificar Estado'
                                        )}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-10">
                            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h3>
                            <p className="text-gray-600 mb-6">Tus entradas han sido compradas. Recibirás un correo con los detalles.</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}