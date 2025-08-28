export interface Project {
    id: string;
    name: string;
    description: string;
    owner: string | [];
    projectUsers: [] | string;
    organization: [] | string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProjectStatus =
    | 'Não Iniciado'
    | 'Em progresso'
    | 'Concluído'
    | 'Bloqueado';