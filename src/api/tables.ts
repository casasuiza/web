import { api } from './apiClient';

export interface Table {
  id: string;
  number: number;
  positionX: number;
  positionY: number;
  isActive: boolean;
}

export const tablesApi = {
  getAll: () => api.get<Table[]>('/tables'),
  create: (data: Omit<Table, 'id' | 'isActive'>) => api.post<Table>('/tables', data),
  update: (id: string, data: Partial<Table>) => api.put<Table>(`/tables/${id}`, data),
  delete: (id: string) => api.delete(`/tables/${id}`)
};