import { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface MercadoPagoPaymentBrickProps {
    publicKey: string;
    preferenceId: string;
    onReady: () => void;
    onSubmit: (formData: unknown) => Promise<void>;
    onError: (error: unknown) => void;
    amount: number;
    email: string;
    dni: string;
}

export function MercadoPagoPaymentBrick({
    publicKey,
    preferenceId,
    onReady,
    onSubmit,
    onError,
    amount,
    email,
    dni
}: MercadoPagoPaymentBrickProps) {

    useEffect(() => {
        if (!publicKey) {
            console.error("Mercado Pago Public Key no proporcionada.");
            return;
        }
        try {
            initMercadoPago(publicKey, { locale: 'es-AR' });
        } catch (error) {
            console.error("Error al inicializar Mercado Pago SDK (initMercadoPago):", error);
            onError(error);
        }
    }, [publicKey, onError]);


    const initialization = {
        amount: amount,
        preferenceId: preferenceId,
        redirectMode: 'modal' as const,
        currencyId: 'ARS',
        paymentMethodId: 'mercado_pago',
        payer: {
            email: email,
            identification: {
                type: 'DNI',
                number: dni,
            },
        },
        paymentMethod: {
            id: 'mercado_pago',
        },

    };

    const customization = {
        visual: {
            hideFormTitle: true,
        },
        paymentMethods: {
            creditCard: 'all' as const,
            debitCard: 'all' as const,
            mercadoPago: 'all' as const,
        },
    };

    return (
        <div className="w-full">
            {publicKey && preferenceId ? (
                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                />
            ) : (
                <p>Cargando información de pago...</p>
            )}
        </div>
    );
}