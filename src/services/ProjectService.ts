import axios from 'axios';
import { type Project, type CreateProjectPayload, type UpdateProjectPayload } from '../types/Project';

export const ProjectService = {
    create : async (projectData: CreateProjectPayload): Promise<CreateProjectPayload> => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects`, projectData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao criar projeto:`, error);
            throw error;
        }
    },

    getProjectsByOrganization : async (orgId: string): Promise<Project[]> => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/by-organization/${orgId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar projetos para a organização ${orgId}:`, error);
            throw error;
        }
    },

    getById: async (projectId: string): Promise<Project> => {
        try {
            const response = await axios.get<Project>(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar o projeto ${projectId}:`, error);
            throw error;
        }
    },

    update: async (projectId: string, projectData: UpdateProjectPayload): Promise<Project[]> => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`, projectData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar projetos para a organização ${projectId}:`, error);
            throw error;
        }
    },

    delete : async (projectId: string): Promise<Project[]> => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar projetos para a organização ${projectId}:`, error);
            throw error;
        }
    },
};
