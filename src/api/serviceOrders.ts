import { api } from './apiClient';

export interface ServiceOrder {
  id: string;
  tableId: string;
  table: {
    id: string;
    number: number;
  };
  type: 'FOOD' | 'DRINK';
  items: any[];
  total: number;
  status: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const serviceOrdersApi = {
  getAll: (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    return api.get<ServiceOrder[]>(`/service-orders?${params.toString()}`);
  },
  create: (data: Omit<ServiceOrder, 'id' | 'table' | 'createdAt' | 'updatedAt'>) => 
    api.post<ServiceOrder>('/service-orders', data),
  updateStatus: (id: string, status: string) => 
    api.put<ServiceOrder>(`/service-orders/${id}/status`, { status }),
  getKitchenOrders: () => api.get<ServiceOrder[]>('/service-orders/kitchen')
};