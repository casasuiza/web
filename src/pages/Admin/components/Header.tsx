import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
    activeTab: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onMenuClick }) => {
    const getTitle = (tab: string) => {
        switch (tab) {
            case 'dashboard':
                return 'Dashboard';
            case 'events':
                return 'Eventos';
            case 'add-event':
                return 'Agregar Evento';
            case 'users':
                return 'Usuarios';
            case 'settings':
                return 'Configuración';
            case 'reports':
                return 'Reportes';
            case 'categories':
                return 'Categorías';
            default:
                return 'Dashboard';
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Botón hamburguesa para móvil */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800">
                        {getTitle(activeTab)}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 hidden sm:block">
                        {new Date().toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;