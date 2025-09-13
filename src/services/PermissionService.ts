import axios from "axios";
import { type Permission, type CreatePermissionPayload, type UpdatePermissionPayload } from "../types/Permission";

export const PermissionService = {
  findAll: async (): Promise<Permission[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/permission`);
    return response.data;
  },

  findAllByOrg: async (orgId: string): Promise<Permission[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/permission/organization/${orgId}`);
    return response.data;
  },

  create: async (payload: CreatePermissionPayload): Promise<Permission> => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/permission`, payload);
    return response.data;
  },

  update: async (id: string, payload: UpdatePermissionPayload): Promise<Permission> => {
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/permission/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/permission/${id}`);
  },
};