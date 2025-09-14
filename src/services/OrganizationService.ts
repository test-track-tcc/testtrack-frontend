import axios from 'axios';
import { type OrganizationPayload, type Organization, type AddUserPayload, type OrganizationRole, type OrganizationMember } from '../types/Organization';

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

    getUsersOrganization: async (userId: string): Promise<Organization[]> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/organizations`);
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

    removeUserFromOrganization: async (organizationId: string, userId: string) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/organization/${organizationId}/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar usuário à organização:', error);
            throw error;
        }
    },

    updateUserRole: async (organizationId: string, userId: string, role: OrganizationRole) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/organization/${organizationId}/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar usuário à organização:', error);
            throw error;
        }
    },

    getUsers: async (organizationId: string): Promise<OrganizationMember[]> => {
        try {
            const response = await axios.get<OrganizationMember[]>(`${import.meta.env.VITE_API_BASE_URL}/organization/${organizationId}/users`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar usuários da organização ${organizationId}:`, error);
            throw error;
        }
    },
}
