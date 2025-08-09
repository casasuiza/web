import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Users, DollarSign, TrendingUp, TrendingDown, Eye, Settings, Filter } from 'lucide-react';
import { getDashboardStats, getRecentEvents } from '../../../api/dashboard';

const Dashboard: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('mes');
    const [animateStats, setAnimateStats] = useState(false);
    const [stats, setStats] = useState({
        activeEvents: 0,
        totalTickets: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateStats(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse, eventsResponse] = await Promise.all([
                    getDashboardStats(),
                    getRecentEvents()
                ]);
                setStats(statsResponse.data);
                setEvents(eventsResponse.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statsCards = [
        {
            title: 'Eventos Activos',
            value: stats.activeEvents.toString(),
            change: '+2.5%',
            trend: 'up',
            color: 'from-blue-500 to-blue-600',
            icon: Calendar,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Entradas Vendidas',
            value: stats.totalTickets.toLocaleString(),
            change: '+18.2%',
            trend: 'up',
            color: 'from-emerald-500 to-emerald-600',
            icon: BarChart3,
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Usuarios Registrados',
            value: stats.totalUsers.toString(),
            change: '+12.1%',
            trend: 'up',
            color: 'from-purple-500 to-purple-600',
            icon: Users,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Ingresos Totales',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: '-3.4%',
            trend: 'down',
            color: 'from-rose-500 to-rose-600',
            icon: DollarSign,
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-600'
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Dashboard de Eventos
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Resumen de actividad y métricas principales</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 shadow-sm"
                        >
                            <option value="semana">Última semana</option>
                            <option value="mes">Último mes</option>
                            <option value="trimestre">Último trimestre</option>
                        </select>
                        <button className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden
                                    ${animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                    transform`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Overlay for Hover Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {stat.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-rose-500" />
                                            )}
                                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Events Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
                        <h3 className="text-xl font-bold text-gray-900">Eventos Recientes</h3>
                        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full sm:w-auto justify-center shadow-sm">
                            <Eye className="w-4 h-4" />
                            Ver todos
                        </button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">
                                Cargando eventos...
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No hay eventos disponibles
                            </div>
                        ) : (
                            events.map((event: any) => (
                            <div
                                key={event.id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md gap-3 sm:gap-4"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform flex-shrink-0 mt-1 sm:mt-0" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                            {event.title}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm">
                                            <p className="text-gray-600 flex items-center gap-1 flex-shrink-0">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-1 flex-shrink-0">
                                                <Users className="w-4 h-4" />
                                                {event.sold || 0} vendidos
                                            </p>
                                            <p className="text-gray-600 flex items-center gap-1 flex-shrink-0">
                                                <DollarSign className="w-4 h-4" />
                                                ${event.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-2 sm:mt-0 flex-shrink-0">
                                    <span className={`px-3 py-1 ${event.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'} rounded-full text-sm font-medium`}>
                                        {event.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all">
                                        <Settings className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center sm:text-left shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Crear Evento</h3>
                        <p className="text-blue-100 text-sm mb-4">Organiza tu próximo evento</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto shadow-md">
                            Comenzar
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white text-center sm:text-left shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Generar Reporte</h3>
                        <p className="text-emerald-100 text-sm mb-4">Analiza tu rendimiento</p>
                        <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors w-full sm:w-auto shadow-md">
                            Generar
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center sm:text-left shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Configuración</h3>
                        <p className="text-purple-100 text-sm mb-4">Personaliza tu dashboard</p>
                        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors w-full sm:w-auto shadow-md">
                            Configurar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;