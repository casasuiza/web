import React, { useState, useEffect } from 'react';
import { Ticket, Search, Edit, Trash2, Mail, User, Calendar } from 'lucide-react';
import { getAllTickets } from '../../../api/tickets';

interface TicketData {
    id: number;
    buyerName: string;
    buyerLastName: string;
    buyerEmail: string;
    buyerPhone?: string;
    buyerDni?: string;
    status: string;
    purchaseAt: string;
    event: {
        title: string;
        date: string;
        price: number;
    };
}

interface TicketCardProps {
    ticket: TicketData;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onContact: (id: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete, onContact }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID': return 'Pagado';
            case 'PENDING': return 'Pendiente';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{ticket.buyerName} {ticket.buyerLastName}</h3>
                            <p className="text-sm text-gray-600">{ticket.buyerEmail}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Evento:</span> {ticket.event.title}
                        </div>
                        <div>
                            <span className="font-medium">Fecha evento:</span> {new Date(ticket.event.date).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-medium">Precio:</span> ${ticket.event.price.toLocaleString()}
                        </div>
                        <div>
                            <span className="font-medium">Compra:</span> {new Date(ticket.purchaseAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onContact(ticket.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Contactar"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(ticket.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(ticket.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancelar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TicketStats: React.FC<{ tickets: TicketData[] }> = ({ tickets }) => {
    const paidTickets = tickets.filter(ticket => ticket.status === 'PAID').length;
    const totalRevenue = tickets.filter(ticket => ticket.status === 'PAID').reduce((sum, ticket) => sum + ticket.event.price, 0);
    const pendingTickets = tickets.filter(ticket => ticket.status === 'PENDING').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Tickets Pagados</h3>
                        <p className="text-2xl font-bold text-gray-800">{paidTickets}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
                        <p className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Tickets Pendientes</h3>
                        <p className="text-2xl font-bold text-gray-800">{pendingTickets}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Tickets() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('PAID');
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await getAllTickets();
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.buyerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (id: number) => {
        console.log('Editar ticket:', id);
    };

    const handleDelete = (id: number) => {
        console.log('Cancelar ticket:', id);
    };

    const handleContact = (id: number) => {
        console.log('Contactar comprador:', id);
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Tickets</h2>
            </div>

            {/* Estadísticas */}
            <TicketStats tickets={tickets} />

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar tickets..."
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
                        <option value="PAID">Pagados</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="CANCELLED">Cancelados</option>
                    </select>
                </div>

                {/* Lista de tickets */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Cargando tickets...
                        </div>
                    ) : (
                        <>
                            {filteredTickets.map((ticket) => (
                                <TicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onContact={handleContact}
                                />
                            ))}

                            {filteredTickets.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron tickets que coincidan con los filtros.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}