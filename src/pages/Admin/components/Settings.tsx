import React, { useState } from 'react';
import {
    Save,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Mail,
    Phone,
    MapPin,
    Clock,
    Eye,
    EyeOff
} from 'lucide-react';

const Settings: React.FC = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [showPassword, setShowPassword] = useState(false);
    const [settings, setSettings] = useState({
        // Configuración general
        siteName: 'Casa Suiza',
        siteDescription: 'Centro Cultural Casa Suiza',
        email: 'info@casasuiza.com',
        phone: '+54 11 1234-5678',
        address: 'Av. Corrientes 1234, Buenos Aires',
        timezone: 'America/Argentina/Buenos_Aires',

        // Configuración de usuario
        adminName: 'Administrador',
        adminEmail: 'admin@casasuiza.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',

        // Configuración de notificaciones
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        eventReminders: true,
        salesAlerts: true,

        // Configuración de seguridad
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,

        // Configuración de apariencia
        theme: 'light',
        primaryColor: '#dc2626',
        language: 'es',
        dateFormat: 'DD/MM/YYYY',

        // Configuración de eventos
        defaultEventDuration: 120,
        maxCapacity: 200,
        ticketSalesHours: 24,
        refundPolicy: 'flexible'
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (_section: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        console.log('Configuración guardada:', settings);
        // Aquí iría la lógica para guardar la configuración
    };

    const settingSections = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'user', label: 'Usuario', icon: User },
        { id: 'notifications', label: 'Notificaciones', icon: Bell },
        { id: 'security', label: 'Seguridad', icon: Shield },
        { id: 'appearance', label: 'Apariencia', icon: Palette },
        { id: 'events', label: 'Eventos', icon: Clock },
    ];

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración General</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Sitio
                    </label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                    </label>
                    <select
                        value={settings.timezone}
                        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="America/Argentina/Buenos_Aires">Buenos Aires</option>
                        <option value="America/Argentina/Cordoba">Córdoba</option>
                        <option value="America/Argentina/Mendoza">Mendoza</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Sitio
                    </label>
                    <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-24"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email de Contacto
                    </label>
                    <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-2" />
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-2" />
                        Dirección
                    </label>
                    <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderUserSettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Usuario</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Administrador
                    </label>
                    <input
                        type="text"
                        value={settings.adminName}
                        onChange={(e) => handleInputChange('user', 'adminName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email del Administrador
                    </label>
                    <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleInputChange('user', 'adminEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={settings.currentPassword}
                            onChange={(e) => handleInputChange('user', 'currentPassword', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                            placeholder="Ingresa tu contraseña actual"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={settings.newPassword}
                        onChange={(e) => handleInputChange('user', 'newPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Nueva contraseña"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        value={settings.confirmPassword}
                        onChange={(e) => handleInputChange('user', 'confirmPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Confirma tu nueva contraseña"
                    />
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Notificaciones</h3>

            <div className="space-y-4">
                {[
                    { key: 'emailNotifications', label: 'Notificaciones por Email', desc: 'Recibir notificaciones importantes por correo electrónico' },
                    { key: 'smsNotifications', label: 'Notificaciones por SMS', desc: 'Recibir alertas urgentes por mensaje de texto' },
                    { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Recibir notificaciones en tiempo real' },
                    { key: 'eventReminders', label: 'Recordatorios de Eventos', desc: 'Recibir recordatorios antes de cada evento' },
                    { key: 'salesAlerts', label: 'Alertas de Ventas', desc: 'Notificaciones sobre ventas y transacciones' }
                ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-800">{notification.label}</h4>
                            <p className="text-sm text-gray-600">{notification.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings[notification.key as keyof typeof settings] as boolean}
                                onChange={(e) => handleInputChange('notifications', notification.key, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Seguridad</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="font-medium text-gray-800">Autenticación de Dos Factores</h4>
                        <p className="text-sm text-gray-600">Agregar una capa extra de seguridad a tu cuenta</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiempo de Sesión (minutos)
                        </label>
                        <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            min="5"
                            max="480"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiración de Contraseña (días)
                        </label>
                        <input
                            type="number"
                            value={settings.passwordExpiry}
                            onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            min="30"
                            max="365"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Apariencia</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema
                    </label>
                    <select
                        value={settings.theme}
                        onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="light">Claro</option>
                        <option value="dark">Oscuro</option>
                        <option value="auto">Automático</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Principal
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idioma
                    </label>
                    <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Fecha
                    </label>
                    <select
                        value={settings.dateFormat}
                        onChange={(e) => handleInputChange('appearance', 'dateFormat', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderEventSettings = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Configuración de Eventos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración por Defecto (minutos)
                    </label>
                    <input
                        type="number"
                        value={settings.defaultEventDuration}
                        onChange={(e) => handleInputChange('events', 'defaultEventDuration', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="30"
                        max="480"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacidad Máxima
                    </label>
                    <input
                        type="number"
                        value={settings.maxCapacity}
                        onChange={(e) => handleInputChange('events', 'maxCapacity', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="1"
                        max="1000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cierre de Ventas (horas antes)
                    </label>
                    <input
                        type="number"
                        value={settings.ticketSalesHours}
                        onChange={(e) => handleInputChange('events', 'ticketSalesHours', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="1"
                        max="168"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Política de Reembolso
                    </label>
                    <select
                        value={settings.refundPolicy}
                        onChange={(e) => handleInputChange('events', 'refundPolicy', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="flexible">Flexible</option>
                        <option value="moderate">Moderada</option>
                        <option value="strict">Estricta</option>
                        <option value="no-refund">Sin reembolso</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return renderGeneralSettings();
            case 'user':
                return renderUserSettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'security':
                return renderSecuritySettings();
            case 'appearance':
                return renderAppearanceSettings();
            case 'events':
                return renderEventSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
                <button
                    onClick={handleSave}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar de configuración */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <nav className="space-y-2">
                            {settingSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeSection === section.id
                                        ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <section.icon className="w-5 h-5 mr-3" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;