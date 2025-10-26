import axios from 'axios';
import { type AccessGroup, type CreateAccessGroupPayload, type UpdateAccessGroupPayload } from '../types/AcessGroup';

// Use a sua instância do axios se tiver uma, senão o 'axios' global funciona.
// const axiosInstance = axios; 

export const AccessGroupService = {
  findAllInOrg: async (orgId: string): Promise<AccessGroup[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/access-group/organization/${orgId}`);
    return response.data;
  },

  findOne: async (id: string): Promise<AccessGroup> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/access-group/${id}`);
      return response.data; // Retorna um OBJETO AccessGroup, não um array
    } catch (error) {
      console.error('Erro ao buscar grupo de acesso:', error);
      throw error;
    }
  },

  create: async (payload: CreateAccessGroupPayload): Promise<AccessGroup> => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/access-group`, payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateAccessGroupPayload): Promise<AccessGroup> => {
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/access-group/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/access-group/${id}`);
  },

  addUser: async (groupId: string, userId: string): Promise<AccessGroup> => {
    try {
      const payload = { groupId, userId };
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/access-group/addUser`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar usuário ao grupo:', error);
      throw error;
    }
  },

  removeUser: async (groupId: string, userId: string): Promise<AccessGroup> => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/access-group/${groupId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover usuário do grupo:', error);
      throw error;
    }
  }
};