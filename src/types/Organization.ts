export interface Organization {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrganizationPayload {
    id?: string;
    name: string,
    description: string,
    adminId: string
}

export interface AddUserPayload {
    userId: string;
    organizationId: string;
}