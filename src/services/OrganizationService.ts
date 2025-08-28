import axios from 'axios';
import { type OrganizationPayload, type Organization, type AddUserPayload } from '../types/Organization';

export const OrganizationService = {
    create: async (data: OrganizationPayload): Promise<OrganizationPayload> => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/organization`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating organization:", error);
            throw error;
        }
     },

    get: async (): Promise<Organization[]> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/organization`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar organizações:', error);
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
    }
}
