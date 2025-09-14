import { type Permission } from "./Permission";

export interface AccessGroup {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface CreateAccessGroupPayload {
  name: string;
  description?: string;
  organizationId: string;
  createdById: string;
}

export interface UpdateAccessGroupPayload {
  name?: string;
  description?: string;
  permissionIds?: string[];
}