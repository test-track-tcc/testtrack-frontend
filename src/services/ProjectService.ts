import axios from 'axios';
import { type Project } from '../types/Project';

export const ProjectService = {
    getProjectsByOrganization : async (orgId: string): Promise<Project[]> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/by-organization/${orgId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar projetos para a organização ${orgId}:`, error);
            throw error;
        }
    },
};
