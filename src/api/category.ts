import { api } from "./apiClient";

// Interfaz que representa la estructura de una categoría tal como la devuelve tu API
export interface CategoryData {
  id: string;
  name: string;
}

/**
 * Obtiene todas las categorías del backend.
 * @returns Una promesa que resuelve con un array de objetos CategoryData.
 */
export async function getCategories(): Promise<CategoryData[]> {
  const res = await api.get("/category");
  return res.data;
}

/**
 * Obtiene una categoría específica por su ID.
 * @param id El ID de la categoría a obtener.
 * @returns Una promesa que resuelve con el objeto CategoryData de la categoría.
 */
export async function getCategoryById(id: string): Promise<CategoryData> {
  const res = await api.get(`/category/${id}`);
  return res.data;
}

/**
 * Crea una nueva categoría en el backend.
 * @param category Los datos de la nueva categoría (solo el nombre es requerido para crear).
 * @returns Una promesa que resuelve con el objeto CategoryData de la categoría creada.
 */
export async function createCategory(category: {
  name: string;
}): Promise<CategoryData> {
  const res = await api.post("/category", category);
  return res.data;
}

/**
 * Actualiza una categoría existente en el backend.
 * @param id El ID de la categoría a actualizar.
 * @param category Los datos a actualizar de la categoría (solo el nombre es requerido para actualizar).
 * @returns Una promesa que resuelve con el objeto CategoryData de la categoría actualizada.
 */
export async function updateCategory(
  id: string,
  category: { name: string }
): Promise<CategoryData> {
  const res = await api.put(`/category/${id}`, category);
  return res.data;
}

/**
 * Elimina una categoría del backend.
 * @param id El ID de la categoría a eliminar.
 * @returns Una promesa que resuelve con un mensaje de éxito.
 */
export async function deleteCategory(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/category/${id}`);
  return res.data;
}
