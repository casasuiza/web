import { api } from "./apiClient";

// Interfaz para los datos que se envían al backend para crear una preferencia de pago
export interface PreferenceData {
  orderId?: string;
  ticketId?: string;
  buyerName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  eventTitle?: string;
  buyerDni?: string;
  price?: number;
  amount?: number;
}

export interface PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

export interface BrickPaymentData {
  orderId: string;
  token: string;
  paymentMethodId: string;
  issuerId: string;
  installments: number;
  transactionAmount: number;
  description: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface BrickPaymentResponse {
  id: string;
  status: string;
  statusDetail: string;
  orderId: string;
}

/**
 * Crea una preferencia de pago en el backend.
 * Puedes enviar un `orderId` para que el backend construya la preferencia
 * o los detalles de un solo ticket/evento si no hay una orden pre-existente.
 * @param data Los datos para crear la preferencia de pago.
 * @returns Una promesa que resuelve con el ID de preferencia y el initPoint de MercadoPago.
 */
export async function createPaymentPreference(
  data: PreferenceData
): Promise<PaymentPreferenceResponse> {
  const res = await api.post("/payments/preference", data);
  return res.data;
}

/**
 * Procesa el pago desde el frontend usando los datos del Payment Brick.
 * @param data Información del formulario de pago
 */
export async function processBrickPayment(
  data: BrickPaymentData
): Promise<BrickPaymentResponse> {
  const res = await api.post("/payments/process-payment", data);
  return res.data;
}
