import { api } from "./apiClient";

// Estructura de un Ticket
export interface TicketData {
  id: number;
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  buyerDni: string;
  status: string;
  checkedIn: boolean;
  purchaseAt: string;
  price: number;
  couponId: string | null;
  orderId: string | null;
}

// Interfaz para el payload al crear un ticket
export interface CreateTicketPayload {
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  buyerDni: string;
}

/**
 * Crea un nuevo ticket en el backend.
 * @param payload Los datos para crear el ticket.
 * @returns Una promesa que resuelve con los datos del ticket creado.
 */
export async function createTicket(
  payload: CreateTicketPayload
): Promise<TicketData> {
  const res = await api.post("/ticket", payload); // Asegúrate que la ruta sea '/tickets'
  return res.data;
}

/**
 * Obtiene un ticket por su ID.
 * @param id El ID del ticket.
 * @returns Una promesa que resuelve con los datos del ticket.
 */
export async function getTicketById(id: number): Promise<TicketData> {
  const res = await api.get(`/ticket/${id}`);
  return res.data;
}

// Puedes añadir más funciones si las necesitas (ej. getTickets, updateTicket, deleteTicket)
/*
export async function getTickets(): Promise<TicketData[]> {
  const res = await api.get("/ticket");
  return res.data;
}

export async function updateTicket(id: number, data: Partial<CreateTicketPayload>): Promise<TicketData> {
  const res = await api.put(`/ticket/${id}`, data);
  return res.data;
}

export async function deleteTicket(id: number): Promise<{ message: string }> {
  const res = await api.delete(`/ticket/${id}`);
  return res.data;
}
*/
