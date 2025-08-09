import { User, Mail, Phone, CreditCard, ShoppingCart, AlertCircle } from "lucide-react";

interface PurchaseFormProps {
    buyerName: string;
    buyerLastName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerDni: string;
    quantity: number;
    ticketPrice: number;
    fieldErrors: { [key: string]: string };
    handleInputChange: (field: string, value: string) => void;
    setQuantity: (quantity: number) => void;
    error: string | null;
}

export function PurchaseForm({
    buyerName,
    buyerLastName,
    buyerEmail,
    buyerPhone,
    buyerDni,
    quantity,
    ticketPrice,
    fieldErrors,
    handleInputChange,
    setQuantity,
    error,
}: PurchaseFormProps) {
    const total = ticketPrice * quantity;

    return (
        <>
            {/* Formulario */}
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="inline mr-1" />
                            Nombre *
                        </label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={buyerName}
                            onChange={(e) => handleInputChange('buyerName', e.target.value)}
                        />
                        {fieldErrors.buyerName && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {fieldErrors.buyerName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="inline mr-1" />
                            Apellido *
                        </label>
                        <input
                            type="text"
                            placeholder="Ingresa tu apellido"
                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerLastName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={buyerLastName}
                            onChange={(e) => handleInputChange('buyerLastName', e.target.value)}
                        />
                        {fieldErrors.buyerLastName && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {fieldErrors.buyerLastName}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-1" />
                        Email *
                    </label>
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerEmail ? 'border-red-500' : 'border-gray-300'
                            }`}
                        value={buyerEmail}
                        onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                    />
                    {fieldErrors.buyerEmail && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {fieldErrors.buyerEmail}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone size={16} className="inline mr-1" />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            placeholder="11 1234 5678"
                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={buyerPhone}
                            onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                        />
                        {fieldErrors.buyerPhone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {fieldErrors.buyerPhone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard size={16} className="inline mr-1" />
                            DNI *
                        </label>
                        <input
                            type="text"
                            placeholder="12345678"
                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerDni ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={buyerDni}
                            onChange={(e) => handleInputChange('buyerDni', e.target.value)}
                        />
                        {fieldErrors.buyerDni && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {fieldErrors.buyerDni}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Cantidad y precio */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                    <label className="font-medium text-gray-700 flex items-center">
                        <ShoppingCart size={16} className="mr-2" />
                        Cantidad de entradas:
                    </label>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Precio por entrada:</span>
                    <span>${ticketPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Costo de Servicio:</span>
                    <span>${(total * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 mt-2 pt-2 border-t">
                    <span>Total:</span>
                    <span>${(total + total * 0.1).toLocaleString()}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {error}
                    </p>
                </div>
            )}
        </>
    );
}