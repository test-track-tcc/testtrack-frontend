import React, { useState } from 'react';
type TestType = 'FUNCIONAL' | 'USABILIDADE' | 'DESEMPENHO' | 'SEGURANCA' | 'REGRESSAO';
type PriorityType = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type StatusType = 'PENDENTE' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'BLOQUEADO';

interface Comment {
  idUsuario: string;
  comentario: string;
  data: Date;
}

interface TestFormData {
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
  scripts: string[];
}

function TestCaseFormFunctions() {
    const [formData, setFormData] = useState<TestFormData>({
        titulo: '',
        descricao: '',
        tipoTeste: 'FUNCIONAL',
        prioridade: 'BAIXA',
        id_userCriacao: '',
        idResponsavel: '',
        tempoEstimado: '',
        steps: '',
        resultadoEsperado: '',
        requisitoVinculado: '',
        status: 'PENDENTE',
        comentarios: [
          {
            idUsuario: 'uuid',
            comentario: 'Observação inicial',
            data: new Date('2025-06-09T21:34:52.000Z')
          }
        ],
        anexos: ['http://example.com/image.png'],
        scripts: ['console.log("automação");']
      });
    
      const [newComment, setNewComment] = useState('');
      const [newAttachment, setNewAttachment] = useState('');
      const [newScript, setNewScript] = useState('');
    
      const handleChange = (field: keyof TestFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
          ...formData,
          [field]: event.target.value
        });
      };
    
      const handleSelectChange = (field: keyof TestFormData) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
          ...formData,
          [field]: event.target.value
        });
      };
    
      const addComment = () => {
        if (newComment.trim()) {
          const comment: Comment = {
            idUsuario: 'current-user-id',
            comentario: newComment,
            data: new Date()
          };
          setFormData({
            ...formData,
            comentarios: [...formData.comentarios, comment]
          });
          setNewComment('');
        }
      };
    
      const addAttachment = () => {
        if (newAttachment.trim()) {
          setFormData({
            ...formData,
            anexos: [...formData.anexos, newAttachment]
          });
          setNewAttachment('');
        }
      };
    
      const addScript = () => {
        if (newScript.trim()) {
          setFormData({
            ...formData,
            scripts: [...formData.scripts, newScript]
          });
          setNewScript('');
        }
      };
    
      const removeAttachment = (index: number) => {
        const updatedAttachments = [...formData.anexos];
        updatedAttachments.splice(index, 1);
        setFormData({
          ...formData,
          anexos: updatedAttachments
        });
      };
    
      const removeScript = (index: number) => {
        const updatedScripts = [...formData.scripts];
        updatedScripts.splice(index, 1);
        setFormData({
          ...formData,
          scripts: updatedScripts
        });
      };
    
      const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Formulário enviado:', formData);
      };

    return {
        formData,
        setFormData,
        handleChange,
        handleSelectChange,
        addComment,
        addAttachment,
        addScript,
        removeAttachment,
        removeScript,
        handleSubmit,
        newAttachment,
        setNewAttachment,
        setNewScript,
        newScript
    };
}

export default TestCaseFormFunctions;