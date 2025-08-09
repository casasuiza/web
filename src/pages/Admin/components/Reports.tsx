import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Download,
    Calendar,
    Users,
    DollarSign,
    FileText,
    RefreshCw,
    Eye,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Clock,
    MapPin,
    Menu,
    X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import { getReportsData, getTopEvents, getSalesChart } from '../../../api/reports';

const Reportes: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('mes');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [reportsData, setReportsData] = useState({
        totalRevenue: 0,
        totalEvents: 0,
        totalAttendees: 0,
        occupancyRate: 0
    });
    const [topEvents, setTopEvents] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [previousData, setPreviousData] = useState({
        totalRevenue: 0,
        totalEvents: 0,
        totalAttendees: 0,
        occupancyRate: 0
    });

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return '+0.0%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const getTrendDirection = (current: number, previous: number) => {
        return current >= previous ? 'up' : 'down';
    };

    const eventTypeData = [
        { name: 'Conferencias', value: 35, color: '#3B82F6' },
        { name: 'Workshops', value: 28, color: '#10B981' },
        { name: 'Meetups', value: 20, color: '#F59E0B' },
        { name: 'Seminarios', value: 17, color: '#EF4444' }
    ];

    const kpiData = [
        {
            title: 'Ingresos Totales',
            value: `$${reportsData.totalRevenue.toLocaleString()}`,
            change: calculateChange(reportsData.totalRevenue, previousData.totalRevenue),
            trend: getTrendDirection(reportsData.totalRevenue, previousData.totalRevenue),
            icon: DollarSign,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            title: 'Eventos Realizados',
            value: reportsData.totalEvents.toString(),
            change: calculateChange(reportsData.totalEvents, previousData.totalEvents),
            trend: getTrendDirection(reportsData.totalEvents, previousData.totalEvents),
            icon: Calendar,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Asistentes Totales',
            value: reportsData.totalAttendees.toLocaleString(),
            change: calculateChange(reportsData.totalAttendees, previousData.totalAttendees),
            trend: getTrendDirection(reportsData.totalAttendees, previousData.totalAttendees),
            icon: Users,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Tasa de Ocupación',
            value: `${reportsData.occupancyRate}%`,
            change: calculateChange(reportsData.occupancyRate, previousData.occupancyRate),
            trend: getTrendDirection(reportsData.occupancyRate, previousData.occupancyRate),
            icon: Target,
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const handleExport = (format: string) => {
        setLoading(true);
        setShowExportMenu(false);
        setTimeout(() => {
            setLoading(false);
            alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
        }, 1500);
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const [reportsResponse, eventsResponse, salesResponse] = await Promise.all([
                getReportsData(selectedPeriod),
                getTopEvents(selectedPeriod),
                getSalesChart(selectedPeriod)
            ]);
            
            // Simular datos anteriores para calcular cambios
            const mockPrevious = {
                totalRevenue: reportsResponse.data.totalRevenue * 0.9,
                totalEvents: Math.max(1, reportsResponse.data.totalEvents - 2),
                totalAttendees: reportsResponse.data.totalAttendees * 0.85,
                occupancyRate: Math.max(0, reportsResponse.data.occupancyRate - 5)
            };
            
            setReportsData(reportsResponse.data);
            setTopEvents(eventsResponse.data);
            setSalesData(salesResponse.data);
            setPreviousData(mockPrevious);
        } catch (error) {
            console.error('Error fetching reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [selectedPeriod]);

    const tabs = [
        { id: 'overview', label: 'Resumen', icon: BarChart3 },
        { id: 'sales', label: 'Ventas', icon: DollarSign },
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'analytics', label: 'Análisis', icon: TrendingUp }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Reportes</h1>
                        <p className="text-sm text-gray-600">Casa Suiza</p>
                    </div>
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {showMobileMenu ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="lg:hidden bg-white border-b border-gray-200 p-4 space-y-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="semana">Última semana</option>
                        <option value="mes">Último mes</option>
                        <option value="trimestre">Último trimestre</option>
                        <option value="año">Último año</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={refreshData}
                            className={`flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${loading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600 mx-auto" />
                        </button>

                        <div className="relative flex-1">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Exportar
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {showExportMenu && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        Exportar PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        Exportar Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 lg:p-6">
                <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Reportes & Análisis
                            </h1>
                            <p className="text-gray-600 mt-1">Análisis detallado de eventos y ventas - Casa Suiza</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="semana">Última semana</option>
                                <option value="mes">Último mes</option>
                                <option value="trimestre">Último trimestre</option>
                                <option value="año">Último año</option>
                            </select>

                            <button
                                onClick={refreshData}
                                className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${loading ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Exportar
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showExportMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            Exportar PDF
                                        </button>
                                        <button
                                            onClick={() => handleExport('excel')}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            Exportar Excel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-gray-100 p-1 rounded-lg">
                        {/* Desktop Tabs */}
                        <div className="hidden sm:flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Tabs */}
                        <div className="sm:hidden grid grid-cols-2 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${activeTab === tab.id
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {kpiData.map((kpi, index) => {
                            const IconComponent = kpi.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                                        <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${kpi.color} rounded-lg lg:rounded-xl flex items-center justify-center`}>
                                            <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {kpi.trend === 'up' ? (
                                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {kpi.change}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1 lg:mb-2">{kpi.title}</h3>
                                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{kpi.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Ventas por Mes */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Ventas por Mes</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">Ingresos</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={salesData.slice(0, 7)}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ventas"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Distribución por Tipo de Evento */}
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Tipos de Eventos</h3>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium self-start sm:self-center">
                                    Ver detalles
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex justify-center sm:justify-start">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <RechartsPieChart>
                                            <Tooltip />
                                            <RechartsPieChart>
                                                {eventTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </RechartsPieChart>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    {eventTypeData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-600">{item.value}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Events - Solo en overview */}
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Eventos Más Exitosos</h3>
                                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors self-start sm:self-center">
                                    <Eye className="w-4 h-4" />
                                    Ver todos
                                </button>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Evento</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Asistentes</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Ingresos</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Crecimiento</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Ubicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topEvents.slice(0, 5).map((event: any, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-gray-900">{event.name}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(event.date).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        {event.attendees}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <DollarSign className="w-4 h-4" />
                                                        ${event.revenue.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1 text-emerald-600">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                        +5%
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        {event.location}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {topEvents.slice(0, 5).map((event: any, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="font-medium text-gray-900 text-sm">{event.name}</div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                {event.attendees}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <DollarSign className="w-4 h-4" />
                                                ${event.revenue.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <ArrowUpRight className="w-4 h-4" />
                                                +5%
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'sales' && (
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Análisis de Ventas</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="ventas" stroke="#3B82F6" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Gestión de Eventos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {topEvents.map((event: any, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{event.name}</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                {event.attendees} asistentes
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                ${event.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Análisis Avanzado</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Distribución por Tipo</h4>
                                    <div className="space-y-3">
                                        {eventTypeData.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-sm text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Métricas Clave</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Promedio por evento</span>
                                            <span className="font-medium">${(reportsData.totalRevenue / Math.max(reportsData.totalEvents, 1)).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Asistentes por evento</span>
                                            <span className="font-medium">{Math.round(reportsData.totalAttendees / Math.max(reportsData.totalEvents, 1))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white hover:from-red-600 hover:to-red-700 transition-all group"
                        >
                            <FileText className="w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base lg:text-lg font-semibold mb-1 lg:mb-2">Exportar PDF</h3>
                            <p className="text-red-100 text-sm">Genera reporte completo en PDF</p>
                        </button>

                        <button
                            onClick={() => handleExport('excel')}
                            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white hover:from-green-600 hover:to-green-700 transition-all group"
                        >
                            <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base lg:text-lg font-semibold mb-1 lg:mb-2">Exportar Excel</h3>
                            <p className="text-green-100 text-sm">Descarga datos en formato Excel</p>
                        </button>

                        <button className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all group sm:col-span-2 lg:col-span-1">
                            <Clock className="w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-base lg:text-lg font-semibold mb-1 lg:mb-2">Programar Reporte</h3>
                            <p className="text-purple-100 text-sm">Configura reportes automáticos</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reportes;