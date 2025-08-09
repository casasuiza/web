import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({
        payment_id: "",
        status: "",
        merchant_order_id: "",
    });

    useEffect(() => {
        setPaymentInfo({
            payment_id: searchParams.get("payment_id") || "",
            status: searchParams.get("status") || "",
            merchant_order_id: searchParams.get("merchant_order_id") || "",
        });
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <h1 className="text-3xl font-bold text-green-800 mb-4">¡Pago exitoso! 🎉</h1>
            <p className="text-lg text-green-700 mb-2">Gracias por tu compra.</p>

            <div className="bg-white p-4 rounded shadow mt-4">
                <p><strong>ID del pago:</strong> {paymentInfo.payment_id}</p>
                <p><strong>Estado:</strong> {paymentInfo.status}</p>
                <p><strong>Orden del comercio:</strong> {paymentInfo.merchant_order_id}</p>
            </div>
        </div>
    );
}
