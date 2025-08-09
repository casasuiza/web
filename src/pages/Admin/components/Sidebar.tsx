import React from 'react';
import { Plus, Ticket, Users, Calendar, BarChart3, Settings, LogOut, X, BookIcon, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/auth';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'add-event', label: 'Agregar Evento', icon: Plus },
        { id: 'categories', label: 'Gestionar Categorías', icon: Tag },
        { id: 'reports', label: 'Reportes', icon: BookIcon },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'tickets', label: 'Tickets', icon: Ticket },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    const handleMenuItemClick = (tabId: string) => {
        setActiveTab(tabId);
        onClose();
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
  fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg h-full
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  flex flex-col
`}>
                {/* Header del sidebar */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Casa Suiza</h2>
                        <p className="text-sm text-gray-600">Panel de Administración</p>
                    </div>
                    {/* Botón cerrar para móvil */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menú de navegación */}
                <div className="mt-6 flex-grow">
                    <nav>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleMenuItemClick(item.id)}
                                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeTab === item.id
                                    ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Logout button abajo del todo */}
                <div className="p-4">
                    <button
                        className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;