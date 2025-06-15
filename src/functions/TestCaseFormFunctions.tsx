import React, { useState } from 'react';
import { type SelectChangeEvent } from '@mui/material/Select';
type TestType = 'FUNCIONAL' | 'USABILIDADE' | 'DESEMPENHO' | 'SEGURANCA' | 'REGRESSAO';
type PriorityType = 'NENHUM' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type StatusType = 'NAO_INICIADO' | 'PENDENTE' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'BLOQUEADO' | 'FALHA' | 'APROVADO' | 'REVISAO_PENDENTE' | 'RETESTANDO' | 'CANCELADO';

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
  scripts: { url: string, name: string }[]
}

function TestCaseFormFunctions() {
    const [formData, setFormData] = useState<TestFormData>({
        titulo: '',
        descricao: '',
        tipoTeste: 'FUNCIONAL',
        prioridade: 'MEDIA',
        id_userCriacao: '',
        idResponsavel: '',
        tempoEstimado: '',
        steps: '',
        resultadoEsperado: '',
        requisitoVinculado: '',
        status: 'NAO_INICIADO',
        comentarios: [
          {
            idUsuario: 'uuid',
            comentario: 'Observação inicial',
            data: new Date('2025-06-09T21:34:52.000Z')
          }
        ],
        anexos: ['http://example.com/image.png'],
        scripts: []
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
    
    const handleSelectChange = <K extends keyof TestFormData>(prop: K) => (event: SelectChangeEvent<TestFormData[K] extends string ? TestFormData[K] : string>) => {
      const newValue = event.target.value as TestFormData[K];
      
      setFormData((prev) => ({
        ...prev,
        [prop]: newValue,
      }));
    };

  // DEBUG: Use este useEffect para ver o estado formData sempre que ele for atualizado
  React.useEffect(() => {
      console.log("Estado formData atualizado:", formData);
  }, [formData]);
    
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
          scripts: [
            ...formData.scripts,
            { url: newScript, name: newScript }
          ]
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        const newScripts = files.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name
        }));

        setFormData(prev => ({
          ...prev,
          scripts: [...prev.scripts, ...newScripts]
        }));
        console.log('Scripts adicionados:', newScripts)
      }
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
        newScript,
        handleFileChange
    };
}

export default TestCaseFormFunctions;