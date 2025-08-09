import { api } from "./apiClient";

export const getReportsData = async (period: string = 'mes') => {
  try {
    const response = await api.get(`/reports/data?period=${period}`);
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const getTopEvents = async (period: string = 'mes') => {
  try {
    const response = await api.get(`/reports/top-events?period=${period}`);
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const getSalesChart = async (period: string = 'mes') => {
  try {
    const response = await api.get(`/reports/sales-chart?period=${period}`);
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};