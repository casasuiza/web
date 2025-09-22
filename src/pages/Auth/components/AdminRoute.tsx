import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessAdmin } from '../../../api/permissions';

interface AdminRouteProps {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!canAccessAdmin(user?.role || user?.rol)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta sección.</p>
                    <p className="text-sm text-gray-500 mb-4">Tu rol: {user?.role || user?.rol || 'No definido'}</p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}