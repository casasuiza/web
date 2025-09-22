import { api } from './apiClient';

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  photo?: string;
  biography?: string;
  contact?: string;
  socialMedia?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtistData {
  name: string;
  genre?: string;
  photo?: string;
  biography?: string;
  contact?: string;
  socialMedia?: any;
}

export const getArtists = async (): Promise<Artist[]> => {
  const response = await api.get('/artists');
  return response.data;
};

export const getArtistById = async (id: string): Promise<Artist> => {
  const response = await api.get(`/artists/${id}`);
  return response.data;
};

export const createArtist = async (artistData: CreateArtistData): Promise<Artist> => {
  const response = await api.post('/artists', artistData);
  return response.data;
};

export const updateArtist = async (id: string, artistData: Partial<CreateArtistData>): Promise<Artist> => {
  const response = await api.put(`/artists/${id}`, artistData);
  return response.data;
};

export const deleteArtist = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/artists/${id}`);
  return response.data;
};

export const assignArtistToEvent = async (eventId: string, artistId: string): Promise<void> => {
  await api.post(`/events/${eventId}/artists`, { artistId });
};

export const removeArtistFromEvent = async (eventId: string, artistId: string): Promise<void> => {
  await api.delete(`/events/${eventId}/artists/${artistId}`);
};