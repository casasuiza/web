import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Home/components/Header";
import Footer from "./Home/components/Footer";

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate('/');
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigate]);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <>
            <Header />
            <main className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    {/* Número 404 grande */}
                    <div className="text-9xl font-bold text-gray-200 mb-4">
                        404
                    </div>

                    {/* Mensaje principal */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Página no encontrada
                    </h1>

                    {/* Descripción */}
                    <p className="text-gray-600 mb-8">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </p>

                    {/* Botón para volver al inicio */}
                    <button
                        onClick={handleGoHome}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Volver al inicio
                    </button>

                    {/* Mensaje adicional */}
                    <p className="text-sm text-gray-500 mt-6">
                        ¿Necesitas ayuda? Puedes volver a la página principal para encontrar eventos disponibles.
                    </p>

                    <div className="text-sm text-gray-500 mt-4">
                        Redireccionando en <span className="font-semibold">{countdown}</span> segundos...
                    </div>
                </div>

                {/* Decoración opcional - icono de evento */}
                <div className="mt-8 text-6xl text-gray-300">
                    🎫
                </div>
            </main>
            <Footer />
        </>
    );
}