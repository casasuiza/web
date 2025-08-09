// src/api/orders.ts
import { api } from "./apiClient";

// Interfaz que representa la estructura de una orden tal como la devuelve tu API
export interface OrderData {
  id: string;
  userId: string | null;
  totalPrice: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  tickets?: {
    id: number;
    eventId: string;
    buyerName: string;
    buyerLastName: string;
    buyerEmail: string;
    buyerPhone: string | null;
    buyerDni: string | null;
    status: string;
    price: number;
  }[];
  Payment?: {
    id: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

// Interfaz para el payload al crear una orden
export interface CreateOrderPayload {
  userId?: string | null;
  ticketIds: number[];
}

/**
 * Crea una nueva orden en el backend.
 * @param payload Los datos para crear la orden (userId y IDs de tickets).
 * @returns Una promesa que resuelve con los datos de la orden creada.
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<OrderData> {
  const res = await api.post("/order", payload);
  return res.data;
}

/**
 * Obtiene una orden específica por su ID.
 * @param id El ID de la orden a obtener.
 * @returns Una promesa que resuelve con el objeto OrderData de la orden.
 */
export async function getOrderById(id: string): Promise<OrderData> {
  const res = await api.get(`/order/${id}`);
  return res.data;
}

/**
 * Obtiene todas las órdenes del backend.
 * @returns Una promesa que resuelve con un array de objetos OrderData.
 */
export async function getOrders(): Promise<OrderData[]> {
  const res = await api.get("/order");
  return res.data;
}

// Si necesitas funciones para actualizar o eliminar órdenes, las añadirías aquí:
/*
export async function updateOrder(id: string, data: Partial<OrderData>): Promise<OrderData> {
  const res = await api.put(`/order/${id}`, data);
  return res.data;
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/order/${id}`);
  return res.data;
}
*/
