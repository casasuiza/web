import { useSearchParams } from "react-router-dom";

export default function PaymentPendingPage() {
    const [params] = useSearchParams();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
            <h1 className="text-3xl font-bold text-yellow-800 mb-4">Pago pendiente ⏳</h1>
            <p className="text-lg text-yellow-700">Tu pago está siendo procesado.</p>

            <div className="bg-white p-4 rounded shadow mt-4">
                <p><strong>ID de pago:</strong> {params.get("payment_id")}</p>
                <p><strong>Estado:</strong> {params.get("status")}</p>
                <p><strong>ID de orden:</strong> {params.get("merchant_order_id")}</p>
            </div>
        </div>
    );
}
