import { useSearchParams } from "react-router-dom";

export default function PaymentFailurePage() {
    const [params] = useSearchParams();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
            <h1 className="text-3xl font-bold text-red-800 mb-4">Pago rechazado ❌</h1>
            <p className="text-lg text-red-700">Tu pago no se pudo completar.</p>

            <div className="bg-white p-4 rounded shadow mt-4">
                <p><strong>ID de pago:</strong> {params.get("payment_id")}</p>
                <p><strong>Estado:</strong> {params.get("status")}</p>
                <p><strong>ID de orden:</strong> {params.get("merchant_order_id")}</p>
            </div>
        </div>
    );
}
