import { useState } from 'react';
import { createSubscriber } from '../../../api/subscribers';
import { AxiosError } from 'axios';

export default function Subscriber() {
    // Estados para el formulario de suscripción
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);

    // Validación de email
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validación de teléfono (formato argentino)
    const isValidPhone = (phone: string): boolean => {
        const phoneRegex = /^(\+54|54)?[0-9]{8,13}$/;
        return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
    };

    // Manejador de envío del formulario de suscripción
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setMessageType('');

        // Validación de campos
        if (!email && !phone) {
            setMessage('Por favor, ingresa al menos un email o teléfono.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        if (email && !isValidEmail(email)) {
            setMessage('Por favor, ingresa un email válido.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        if (phone && !isValidPhone(phone)) {
            setMessage('Por favor, ingresa un teléfono válido.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        interface SubscriberData {
            subMail: string;
            subPhone: string;
        }

        try {
            // Crear el objeto solo si los campos están presentes
            const subscriberData: Partial<SubscriberData> = {};
            if (email.trim()) subscriberData.subMail = email.trim();
            if (phone.trim()) subscriberData.subPhone = phone.replace(/[\s\-()]/g, '');

            // Validar que al menos uno esté presente
            await createSubscriber(subscriberData as SubscriberData);

            // Mostrar notificación de éxito
            setMessage('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.');
            setMessageType('success');
            setShowNotification(true);

            // Limpiar formulario
            setEmail('');
            setPhone('');

            // Ocultar notificación después de 5 segundos
            setTimeout(() => {
                setShowNotification(false);
                setMessage('');
                setMessageType('');
            }, 5000);

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Hubo un error al intentar suscribirte. Por favor, inténtalo de nuevo.';
                setMessage(errorMessage);
                setMessageType('error');
            } else {
                console.error('Error inesperado al suscribirse:', error);
                setMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
                setMessageType('error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Cerrar notificación manualmente
    const closeNotification = () => {
        setShowNotification(false);
        setMessage('');
        setMessageType('');
    };

    return (
        <>
            {/* Notificación flotante de éxito */}
            {showNotification && messageType === 'success' && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">¡Suscripción exitosa!</span>
                        </div>
                        <button
                            onClick={closeNotification}
                            className="ml-4 text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm mt-1 text-green-100">
                        Recibirás nuestras novedades en {email && phone ? 'tu email y teléfono' : email ? 'tu email' : 'tu teléfono'}.
                    </p>
                </div>
            )}

            {/* Newsletter Section */}
            <div className="bg-red-700 border-t border-red-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2 text-white">¡Mantente Informado!</h3>
                        <p className="text-white/90 text-sm mb-4">
                            Suscríbete a nuestro boletín para recibir noticias sobre eventos especiales y ofertas.
                        </p>
                        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                            <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                <input
                                    type="email"
                                    placeholder="Tu email"
                                    className="flex-1 px-4 py-2 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 transition-all duration-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                <input
                                    type="tel"
                                    placeholder="Tu teléfono (opcional)"
                                    className="flex-1 px-4 py-2 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 transition-all duration-200"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-white text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Suscribiendo...
                                    </div>
                                ) : (
                                    'Suscribirse'
                                )}
                            </button>
                        </form>

                        {/* Mensaje de error inline */}
                        {message && messageType === 'error' && (
                            <div className="mt-4 p-3 bg-red-600 border border-red-500 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-red-100">{message}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-white/70 text-xs mt-3">
                            * Puedes suscribirte con email y teléfono o solo email.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}