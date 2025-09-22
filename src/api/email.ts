import { api } from './apiClient';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  variables?: any;
}

export interface SendEmailData {
  to: string;
  templateName: string;
  variables: {
    [key: string]: any;
  };
}

export const sendTicketEmail = async (ticketId: number): Promise<{ message: string }> => {
  const response = await api.post(`/tickets/${ticketId}/send-email`);
  return response.data;
};

export const sendBulkTicketEmails = async (ticketIds: number[]): Promise<{ message: string }> => {
  const response = await api.post('/tickets/send-bulk-emails', { ticketIds });
  return response.data;
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const response = await api.get('/email-templates');
  return response.data;
};

export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> => {
  const response = await api.post('/email-templates', template);
  return response.data;
};

export const updateEmailTemplate = async (id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
  const response = await api.put(`/email-templates/${id}`, template);
  return response.data;
};

export const deleteEmailTemplate = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/email-templates/${id}`);
  return response.data;
};