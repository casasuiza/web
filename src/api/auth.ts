import { api } from "./apiClient";

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error;
  }
};

export const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      console.error("Error en la llamada a la API:", error);
      throw error;
    }
  };
