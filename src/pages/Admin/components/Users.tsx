import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Plus, Edit, Mail, UserCheck, UserX, Calendar, Crown } from 'lucide-react';
import { getUsersWithStats, toggleUserActive } from '../../../api/users';
import UserModal from './UserModal';

interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: string;
}

interface UserCardProps {
    user: User;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onContact: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onContact }) => {
    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Activo' : 'Inactivo';
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{user.username}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            {user.role === 'ADMIN' ? (
                                <Crown className="w-4 h-4 text-yellow-500" />
                            ) : (
                                <UserCheck className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="font-medium">Rol:</span> 
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Registro:</span> {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">ID:</span> 
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{user.id.substring(0, 8)}...</code>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        {user.isActive ? (
                            <UserCheck className="w-4 h-4 text-green-500" />
                        ) : (
                            <UserX className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                            {getStatusText(user.isActive ? 'active' : 'inactive')}
                        </span>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onContact(user.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Enviar email"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(user.id)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar usuario"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {user.isActive ? (
                            <button
                                onClick={() => onDelete(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Desactivar usuario"
                            >
                                <UserX className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => onDelete(user.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Activar usuario"
                            >
                                <UserCheck className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserStats: React.FC<{ users: User[] }> = ({ users }) => {
    const activeUsers = users.filter(user => user.isActive).length;
    const adminUsers = users.filter(user => user.role === 'ADMIN').length;
    const totalUsers = users.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Total Usuarios</h3>
                        <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Usuarios Activos</h3>
                        <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Administradores</h3>
                        <p className="text-2xl font-bold text-gray-800">{adminUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsersWithStats();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);



    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || 
            (filterStatus === 'active' && user.isActive) ||
            (filterStatus === 'inactive' && !user.isActive);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const handleEdit = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setEditingUser(user);
            setModalOpen(true);
        }
    };

    const handleToggleActive = async (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            try {
                await toggleUserActive(id, !user.isActive);
                // Recargar usuarios
                const response = await getUsersWithStats();
                setUsers(response.data);
            } catch (error) {
                console.error('Error al cambiar estado:', error);
            }
        }
    };

    const handleContact = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            window.open(`mailto:${user.email}`, '_blank');
        }
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const handleSaveUser = (userData: any) => {
        if (editingUser) {
            console.log('Actualizar usuario:', editingUser.id, userData);
        } else {
            console.log('Crear usuario:', userData);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button
                    onClick={handleNewUser}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Estadísticas */}
            <UserStats users={users} />

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                    
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="ADMIN">Administradores</option>
                        <option value="USER">Usuarios</option>
                    </select>
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Cargando usuarios...
                        </div>
                    ) : (
                        <>
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onEdit={handleEdit}
                                    onDelete={handleToggleActive}
                                    onContact={handleContact}
                                />
                            ))}

                            {filteredUsers.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron usuarios que coincidan con los filtros.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            />
        </div>
    );
}