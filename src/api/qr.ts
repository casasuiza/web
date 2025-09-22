import { api } from './apiClient';

export interface QRCodeData {
  ticketId: number;
  qrCode: string;
  url: string;
}

export const generateQRCode = async (ticketId: number): Promise<QRCodeData> => {
  const response = await api.post(`/tickets/${ticketId}/generate-qr`);
  return response.data;
};

export const validateQRCode = async (qrCode: string): Promise<{
  valid: boolean;
  ticket?: any;
  message: string;
}> => {
  const response = await api.post('/qr/validate', { qrCode });
  return response.data;
};

export const checkInTicket = async (qrCode: string): Promise<{
  success: boolean;
  ticket?: any;
  message: string;
}> => {
  const response = await api.post('/qr/checkin', { qrCode });
  return response.data;
};