import { api } from "./apiClient";

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats");
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const getRecentEvents = async () => {
  try {
    const response = await api.get("/events");
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};