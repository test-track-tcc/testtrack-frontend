import axios from 'axios';
import { type OrganizationPayload, type Organization, type AddUserPayload } from '../types/Organization';
import { type User } from '../types/User';

export const OrganizationService = {
    get: async (): Promise<Organization[]> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/organization`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar organizações:', error);
            throw error;
        }
    },

    create: async (data: OrganizationPayload): Promise<OrganizationPayload> => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/organization`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating organization:", error);
            throw error;
        }
     },

    update: async (id: string, payload: Partial<OrganizationPayload>): Promise<Organization> => {
        try {
        const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/organization/${id}`, payload);
        return response.data;
        } catch (error) {
        console.error("Error updating organization:", error);
        throw error;
        }
    },

    delete: async (id: string): Promise<Organization> => {
        try {
        const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/organization/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error updating organization:", error);
        throw error;
        }
    },

    addUserToOrganization: async (data: AddUserPayload) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/organization/addUser`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar usuário à organização:', error);
            throw error;
        }
    },

    getUsers: async (organizationId: string): Promise<User[]> => {
        try {
            const response = await axios.get<User[]>(`${import.meta.env.VITE_API_BASE_URL}/organization/${organizationId}/users`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuários da organização ${organizationId}:`, error);
            throw error;
        }
    },
}
