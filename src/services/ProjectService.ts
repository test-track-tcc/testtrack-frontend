import axios from 'axios';
import { type User } from '../types/User';
import { type Project, type CreateProjectPayload, type UpdateProjectPayload, type AddUserToProjectPayload } from '../types/Project';

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

    findAllInOrg: async (orgId: string): Promise<Project[]> => {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/organization/${orgId}`);
        return response.data;
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

    getUsers: async (projectId: string): Promise<User[]> => {
        try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/users`);
        return response.data.map((projectUser: any) => projectUser.user);
        } catch (error) {
        console.error(`Erro ao buscar utilizadores do projeto ${projectId}:`, error);
        throw error;
        }
    },

    addUserToProject: async (projectId: string, payload: AddUserToProjectPayload): Promise<any> => {
        try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/users`, payload);
        return response.data;
        } catch (error) {
        console.error(`Erro ao adicionar utilizador ao projeto ${projectId}:`, error);
        throw error;
        }
    },

    removeUserFromProject: async (projectId: string, userId: string): Promise<void> => {
        try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/users/${userId}`);
        } catch (error) {
        console.error(`Erro ao remover o utilizador do projeto:`, error);
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
