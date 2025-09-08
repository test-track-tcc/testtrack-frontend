import { type Organization } from "./Organization";
import { type User } from "./User";

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  estimateEnd: string | null;
  conclusionDate: string | null;
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

export const ProjectStatus = {
  NOT_STARTED: 'Não Iniciado',
  IN_PROGRESS: 'Em progresso',
  FINISHED: 'Concluído',
  BLOCKED: 'Bloqueado',
} as const;
