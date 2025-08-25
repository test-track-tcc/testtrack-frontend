import axios from 'axios';
import { type OrganizationPayload } from '../types/Organization';

export const OrganizationService = {
    create: async (data: OrganizationPayload): Promise<OrganizationPayload> => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/organization`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating organization:", error);
            throw error;
        }
     }

};
