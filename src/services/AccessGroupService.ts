import axios from 'axios';
import { type AccessGroup, type CreateAccessGroupPayload, type UpdateAccessGroupPayload } from '../types/AcessGroup';

export const AccessGroupService = {
  findAllInOrg: async (orgId: string): Promise<AccessGroup[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/access-group/organization/${orgId}`);
    return response.data;
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
};