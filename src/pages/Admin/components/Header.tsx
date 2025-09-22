import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../Auth/context/AuthContext';
import { getRoleBadgeColor, getRoleIcon, roleLabels, type UserRole } from '../../../api/permissions';

interface HeaderProps {
    activeTab: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onMenuClick }) => {
    const { user } = useAuth();
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
            case 'artists':
                return 'Artistas';
            case 'coupons':
                return 'Cupones';
            case 'qr-scanner':
                return 'Scanner QR';
            case 'tickets':
                return 'Tickets';
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
                    
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user?.role || user?.rol)}`}>
                                    {getRoleIcon(user?.role || user?.rol)} {roleLabels[(user?.role || user?.rol)?.toUpperCase() as UserRole] || 'Usuario'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{user?.username || 'Usuario'}</p>
                        </div>
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;