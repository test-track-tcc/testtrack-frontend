import { type Project } from "./Project";

export interface Report {
  id: string;
  fileName: string;
  generatedAt: string;
  project: Project;
}