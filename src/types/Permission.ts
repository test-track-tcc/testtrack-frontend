export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface CreatePermissionPayload {
  name: string;
  description?: string;
  createdById: string;
  projectId: string;
}

export type UpdatePermissionPayload = Partial<Omit<CreatePermissionPayload, 'createdById' | 'projectId'>>;