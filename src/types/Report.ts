import { type Project } from "./Project";

export interface Report {
  id: string;
  fileName: string;
  generatedAt: string;
  status: string;
  project: Project;
}