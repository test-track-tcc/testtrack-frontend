import type { ScriptFile } from "./ScriptFile";
import type { TestType, PriorityType, StatusType } from "./TestTypes";

export interface Comment {
  idUsuario: string;
  comentario: string;
  data: Date;
}

export interface TestFormData {
  id?: string;
  titulo: string;
  descricao: string;
  tipoTeste: TestType;
  prioridade: PriorityType;
  id_userCriacao: string;
  idResponsavel: string;
  tempoEstimado: string;
  steps: string;
  resultadoEsperado: string;
  requisitoVinculado: string;
  status: StatusType;
  comentarios: Comment[];
  anexos: string[];
  scripts: ScriptFile[];
}
