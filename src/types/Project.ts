import { type Organization } from "./Organization";
import { type User } from "./User";

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  estimateEnd?: string;
  conclusionDate?: string;
  prefix: string;
  status: ProjectStatusType;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  owner: User;
}

export interface CreateProjectPayload {
    name: string;
    description: string;
    startDate: string | null;
    estimateEnd: string | null;
    status: string;
    organizationId: string;
    ownerId: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  startDate?: string;
  estimateEnd?: string;
  conclusionDate?: string;
  status?: string;
}

export interface AddUserToProjectPayload {
  userId: string;
}

export const ProjectStatus = {
  NOT_STARTED: 'NAO_INICIADO',
  IN_PROGRESS: 'EM_PROGRESSO',
  FINISHED: 'CONCLUIDO',
  BLOCKED: 'BLOQUEADO',
} as const;
