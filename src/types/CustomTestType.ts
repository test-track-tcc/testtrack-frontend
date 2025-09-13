export interface CustomTestType {
  id: string;
  name: string;
  description?: string;
}

export interface CreateTestTypePayload {
  name: string;
  description?: string;
}

export type UpdateTestTypePayload = Partial<CreateTestTypePayload>;
