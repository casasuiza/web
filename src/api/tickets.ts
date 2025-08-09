import { api } from "./apiClient";

export const getAllTickets = async () => {
  try {
    const response = await api.get("/tickets");
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};