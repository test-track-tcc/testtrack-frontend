export interface Comentario {
  idUsuario: string;
  comentario: string;
  data: string;
}

export interface TesteData {
  titulo: string;
  descricao: string;
  tipoTeste: 'FUNCIONAL' | 'REGRESSAO' | 'PERFORMANCE' | 'USABILIDADE' | 'SEGURANCA' | 'OUTRO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  id_userCriacao: string;
  idResponsavel: string;
  tempoEstimado: string;
  steps: string;
  resultadoEsperado: string;
  requisitoVinculado: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'FALHOU' | 'CANCELADO';
  comentarios: Comentario[];
  anexos: string[];
  scripts: string[];
}