import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search, MapPin, Calendar, Users, DollarSign, Star, Clock } from "lucide-react";

import type { EventData } from "../../../api/events";
import { getEvents, deleteEvent } from "../../../api/events";
import AddEventForm from "./AddEventForm";

interface Event extends EventData {
    status: "active" | "soldout" | "expired";
}

interface EventsProps {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

// Componente de Alerta/Mensaje
const AlertMessage: React.FC<{ message: string; type: 'success' | 'error' | "" }> = ({ message, type }) => (
    <div className={`p-4 rounded-lg text-white font-medium shadow-md ${type === 'success'
        ? 'bg-gradient-to-r from-green-500 to-green-600'
        : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}>
        {message}
    </div>
);

// Componente de Tarjeta de Evento
const EventCard: React.FC<{
    event: Event;
    onEdit: (event: EventData) => void;
    onDelete: (id: string) => void;
}> = ({ event, onEdit, onDelete }) => {
    const formatDate = (isoString?: string | null) => {
        if (!isoString) return "";
        try {
            return isoString.split('T')[0];
        } catch (e) {
            console.error("Error formatting date for input:", isoString, e);
            return "";
        }
    };

    const formatTime = (isoString?: string | null) => {
        if (!isoString) return "";
        try {
            return isoString.split('T')[1]?.substring(0, 5) || "";
        } catch (e) {
            console.error("Error formatting time for input:", isoString, e);
            return "";
        }
    };

    const getProgressPercentage = () => {
        if (!event.capacity || event.capacity === 0) return 0;
        return Math.min((event.sold / event.capacity) * 100, 100);
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Header sin imagen */}
            <div className="relative h-20 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <div className="text-white font-bold text-lg">
                    {event.title.slice(0, 2).toUpperCase()}
                </div>

                {/* Badge de promoción */}
                {event.promo && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        PROMO
                    </div>
                )}

                {/* Badge de estado */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                    event.status === "active" ? "bg-green-100 text-green-800" :
                    event.status === "soldout" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                    }`}>
                    {event.status === "active" ? "Activo" : 
                     event.status === "soldout" ? "Agotado" : "Vencido"}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {event.title}
                </h3>

                {event.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {event.description}
                    </p>
                )}

                {/* Información del evento */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{formatTime(event.date)}</span>
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-red-500" />
                        <span className="font-semibold">${event.price}</span>
                    </div>
                </div>

                {/* Barra de progreso de ventas */}
                {event.capacity && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Vendidas: {event.sold}
                            </span>

                            <span className="text-sm text-gray-600">
                                Capacidad: {event.capacity}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getProgressPercentage()}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            onClick={() => onEdit(event)}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => onDelete(event.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente Modal de Confirmación
const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente Principal
const Events: React.FC<EventsProps> = ({ setActiveTab }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "soldout" | "expired">("all");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);
    const [uiMessage, setUiMessage] = useState<string | null>(null);
    const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | ''>('');

    // Funciones utilitarias
    const getStatus = (soldOut?: boolean | null, eventDate?: string): "active" | "soldout" | "expired" => {
        if (eventDate && new Date(eventDate) < new Date()) {
            return "expired";
        }
        return soldOut ? "soldout" : "active";
    };

    const showUiMessage = (message: string, type: 'success' | 'error') => {
        setUiMessage(message);
        setUiMessageType(type);
        setTimeout(() => {
            setUiMessage(null);
            setUiMessageType('');
        }, 5000);
    };

    // Datos dummy para fallback
    const dummyEvents: Event[] = React.useMemo(() => [
        {
            id: "dummy-1",
            title: "Concierto de prueba",
            description: "Este es un evento de ejemplo porque aún no hay eventos o no conecta a la base de datos.",
            location: "Casa Suiza, Buenos Aires",
            date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            capacity: 200,
            promo: true,
            soldOut: false,
            price: 0,
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            categoryId: "cat-rock",
            organizerId: "org-user1",
            status: "active",
            sold: 45,
        }
    ], []);

    // Efecto para cargar eventos desde la API
    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            try {
                const data = await getEvents();
                const mapped = data.map((e) => ({
                    ...e,
                    status: getStatus(e.soldOut, e.date),
                    sold: e.sold,
                }));
                setEvents(mapped);

            } catch (e: unknown) {
                if (e instanceof Error) {
                    showUiMessage(`Error al cargar eventos: ${e.message}`, 'error');
                } else {
                    showUiMessage("Error desconocido al cargar eventos.", 'error');
                }

                // Fallback a datos dummy si la API falla
                const mapped = dummyEvents.map((e) => ({
                    ...e,
                    status: getStatus(e.soldOut, e.date),
                    sold: Math.floor(Math.random() * (e.capacity || 100)),
                }));
                setEvents(mapped);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [dummyEvents]);

    // Filtrado de eventos
    const filteredEvents = events.filter((event) => {
        const matchesStatus = filterStatus === "all" || event.status === filterStatus;
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Handlers
    const handleDelete = (id?: string) => {
        if (!id) {
            showUiMessage("ID del evento no válido para eliminar.", 'error');
            return;
        }
        setEventToDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!eventToDeleteId) return;

        setShowConfirmModal(false);
        try {
            await deleteEvent(eventToDeleteId);

            setEvents(prev => prev.filter(e => e.id !== eventToDeleteId));
            showUiMessage("Evento eliminado correctamente.", 'success');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar el evento.";
            showUiMessage(`Error al eliminar evento: ${errorMessage}`, 'error');
        } finally {
            setEventToDeleteId(null);
        }
    };

    const handleNewEvent = () => {
        setEditingEvent(null);
        setShowForm(false);
        setActiveTab('add-event');
    };

    const handleEditEvent = (event: EventData) => {
        setEditingEvent(event);
        setShowForm(true);
        setTimeout(() => {
            const formElement = document.getElementById('editEvent');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleFormSubmit = (eventData: EventData, isEdit: boolean) => {
        setShowForm(false);
        setEditingEvent(null);

        if (isEdit) {
            setEvents(prev => prev.map(e =>
                e.id === eventData.id
                    ? { ...eventData, status: getStatus(eventData.soldOut, eventData.date), sold: e.sold }
                    : e
            ));
            showUiMessage("Evento actualizado correctamente.", 'success');
        } else {
            const newEvent: Event = {
                ...eventData,
                status: getStatus(eventData.soldOut, eventData.date),
                sold: 0
            };
            setEvents(prev => [...prev, newEvent]);
            showUiMessage("Evento creado correctamente.", 'success');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Mensajes de UI */}
            {uiMessage && (
                <div className="mb-6">
                    <AlertMessage message={uiMessage} type={uiMessageType} />
                </div>
            )}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestión de Eventos</h1>
                            <p className="text-gray-600 mt-1">Administra todos tus eventos desde aquí</p>
                        </div>
                        <button
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={handleNewEvent}
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Evento
                        </button>
                    </div>
                </div>
                {/* Formulario de evento */}
                {showForm && (
                    <div id="editEvent" className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
                        </h3>
                        <AddEventForm
                            initialData={editingEvent || undefined}
                            onClose={() => setShowForm(false)}
                            onSubmit={handleFormSubmit}
                        />
                    </div>
                )}
                {/* Filtros */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título, ubicación o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="lg:w-48">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "soldout" | "expired")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="active">Activos</option>
                                <option value="soldout">Agotados</option>
                                <option value="expired">Vencidos</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No hay eventos para mostrar.</p>
                            </div>
                        ) : (
                            filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onEdit={handleEditEvent}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Modal de confirmación */}
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={confirmDelete}
                    message="¿Estás seguro que deseas eliminar este evento? Esta acción no se puede deshacer."
                />
            </div>
        </div>
    );
};

export default Events;