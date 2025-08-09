import { api } from "./apiClient";

export interface EventData {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string; // ISO string
  capacity: number | null;
  promo: boolean | null;
  soldOut: boolean | null;
  price: number;
  sold: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  organizerId: string | null;
}

// Obtener todos los eventos
export async function getEvents(): Promise<EventData[]> {
  const res = await api.get("/events");
  return res.data;
}

// Obtener evento por ID
export async function getEventById(id: string): Promise<EventData> {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

// Crear nuevo evento
export async function createEvent(event: EventData | FormData): Promise<EventData> {
  const res = await api.post("/event", event, {
    headers: event instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return res.data;
}

// Actualizar evento
export async function updateEvent(
  id: string,
  event: EventData | FormData
): Promise<EventData> {
  const res = await api.put(`/events/${id}`, event, {
    headers: event instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
  return res.data;
}

// Eliminar evento
export async function deleteEvent(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/events/${id}`);
  return res.data;
}
