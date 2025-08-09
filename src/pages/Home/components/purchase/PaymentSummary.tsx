import { CheckCircle } from "lucide-react";
import type { OrderData } from "../../../../api/order";

interface PaymentSummaryProps {
    orderData: OrderData | null;
    buyerName: string;
    buyerLastName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerDni: string;
    quantity: number;
    onClose: () => void;
}

export function PaymentSummary({
    orderData,
    buyerName,
    buyerLastName,
    buyerEmail,
    buyerPhone,
    buyerDni,
    quantity,
}: PaymentSummaryProps) {
    if (!orderData) return null;

    return (
        <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-2">
                <div className="flex items-center mb-3">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800">Orden creada exitosamente</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Comprador:</span>
                        <span className="font-medium">{buyerName} {buyerLastName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{buyerEmail}</span>
                    </div>
                    {buyerPhone && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="font-medium">{buyerPhone}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">DNI:</span>
                        <span className="font-medium">{buyerDni}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Cantidad:</span>
                        <span className="font-medium">{quantity} entrada(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-green-200">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-lg">${orderData.totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </>
    );
}