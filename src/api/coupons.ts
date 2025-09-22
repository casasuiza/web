import { api } from './apiClient';

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
  expiresAt?: string;
  maxUses?: number;
  usedCount: number;
  eventId: string;
  createdAt: string;
}

export interface CreateCouponData {
  code: string;
  discount: number;
  isPercentage: boolean;
  expiresAt?: string;
  maxUses?: number;
  eventId: string;
}

export const getCoupons = async (eventId?: string): Promise<Coupon[]> => {
  const params = eventId ? { eventId } : {};
  const response = await api.get('/coupons', { params });
  return response.data;
};

export const validateCoupon = async (code: string, eventId: string): Promise<Coupon> => {
  const response = await api.post('/coupons/validate', { code, eventId });
  return response.data;
};

export const createCoupon = async (couponData: CreateCouponData): Promise<Coupon> => {
  const response = await api.post('/coupons', couponData);
  return response.data;
};

export const updateCoupon = async (id: string, couponData: Partial<CreateCouponData>): Promise<Coupon> => {
  const response = await api.put(`/coupons/${id}`, couponData);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};