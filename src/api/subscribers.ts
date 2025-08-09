import { api } from "./apiClient";

interface SubscriberData {
  subMail: string;
  subPhone?: string | null;
}

interface SubscriberResponse {
  id: number;
  subMail: string;
  subPhone: string | null;
}

/**
 * Envía una solicitud para crear un nuevo suscriptor.
 * @param data Los datos del suscriptor (correo y opcionalmente teléfono).
 * @returns Una promesa que resuelve con los datos del suscriptor creado.
 */
export async function createSubscriber(
  data: SubscriberData
): Promise<SubscriberResponse> {
  const res = await api.post("/subscribers", data);
  return res.data;
}
