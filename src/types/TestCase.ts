export type TestType = 'FUNCIONAL' | 'USABILIDADE' | 'DESEMPENHO' | 'SEGURANCA' | 'REGRESSAO';
export type PriorityType = 'NENHUM' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type StatusType =
  | 'NAO_INICIADO'
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'BLOQUEADO'
  | 'FALHA'
  | 'APROVADO'
  | 'REVISAO_PENDENTE'
  | 'RETESTANDO'
  | 'CANCELADO'

export interface Comment {
  idUsuario: string;
  comentario: string;
  data: Date;
}

export interface ScriptFile {
  url: string;
  name: string;
  file: File | null;
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
