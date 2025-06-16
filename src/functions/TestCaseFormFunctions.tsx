import React, { useState, useEffect } from 'react';
import { type SelectChangeEvent } from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';

// --- Interfaces (Devem ser mantidas em src/types.ts para organização) ---
// Para este exemplo, vou manter aqui para que seja um arquivo autocontido para teste.
type TestType = 'FUNCIONAL' | 'USABILIDADE' | 'DESEMPENHO' | 'SEGURANCA' | 'REGRESSAO';
type PriorityType = 'NENHUM' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type StatusType = 'NAO_INICIADO' | 'PENDENTE' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'BLOQUEADO' | 'FALHA' | 'APROVADO' | 'REVISAO_PENDENTE' | 'RETESTANDO' | 'CANCELADO';

interface Comment {
  idUsuario: string;
  comentario: string;
  data: Date;
}

interface ScriptFile {
  url: string;
  name: string;
  file: File | null; // <-- MUDANÇA AQUI: Agora aceita File ou null
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
// --- Fim das Interfaces ---

function TestCaseFormFunctions() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('id');

  const [formData, setFormData] = useState<TestFormData>(() => {
    if (editId) {
      const storedTestCases = localStorage.getItem('testCases');
      if (storedTestCases) {
        const parsedTestCases: TestFormData[] = JSON.parse(storedTestCases);
        const testCaseToEdit = parsedTestCases.find(tc => tc.id === editId);
        if (testCaseToEdit) {
          testCaseToEdit.comentarios = testCaseToEdit.comentarios.map((c: Comment) => ({
            ...c,
            data: new Date(c.data),
          }));
          testCaseToEdit.scripts = testCaseToEdit.scripts.map((s: ScriptFile) => ({
            url: s.url,
            name: s.name,
            file: null, // Definir como null ao carregar do localStorage
          }));
          return testCaseToEdit;
        }
      }
    }

    const savedDraft = localStorage.getItem('testCaseFormDraft');
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      parsedDraft.comentarios = parsedDraft.comentarios.map((c: Comment) => ({
        ...c,
        data: new Date(c.data),
      }));
      parsedDraft.scripts = parsedDraft.scripts.map((s: ScriptFile) => ({
        url: s.url,
        name: s.name,
        file: null, // Definir como null ao carregar rascunho
      }));
      return parsedDraft;
    }

    return {
      titulo: '',
      descricao: '',
      tipoTeste: 'FUNCIONAL',
      prioridade: 'MEDIA',
      id_userCriacao: uuidv4(),
      idResponsavel: '',
      tempoEstimado: '',
      steps: '',
      resultadoEsperado: '',
      requisitoVinculado: '',
      status: 'NAO_INICIADO',
      comentarios: [
        {
          idUsuario: uuidv4(),
          comentario: 'Observação inicial (mock)',
          data: new Date('2025-06-09T21:34:52.000Z'),
        },
      ],
      anexos: ['http://example.com/image.png'],
      scripts: [],
    };
  });

  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  useEffect(() => {
    const dataToSave = {
      ...formData,
      scripts: formData.scripts.map(({ url, name }) => ({ url, name })),
    };
    localStorage.setItem('testCaseFormDraft', JSON.stringify(dataToSave));
  }, [formData]);

  useEffect(() => {
    if (editId) {
      const storedTestCases = localStorage.getItem('testCases');
      if (storedTestCases) {
        const parsedTestCases: TestFormData[] = JSON.parse(storedTestCases);
        const testCaseToEdit = parsedTestCases.find(tc => tc.id === editId);
        if (testCaseToEdit) {
          testCaseToEdit.comentarios = testCaseToEdit.comentarios.map((c: Comment) => ({
            ...c,
            data: new Date(c.data),
          }));
          testCaseToEdit.scripts = testCaseToEdit.scripts.map((s: ScriptFile) => ({
            url: s.url,
            name: s.name,
            file: null,
          }));
          setFormData(testCaseToEdit);
          localStorage.removeItem('testCaseFormDraft');
        }
      }
    } else {
        const savedDraft = localStorage.getItem('testCaseFormDraft');
        if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            parsedDraft.comentarios = parsedDraft.comentarios.map((c: Comment) => ({
                ...c,
                data: new Date(c.data),
            }));
            parsedDraft.scripts = parsedDraft.scripts.map((s: ScriptFile) => ({
                url: s.url,
                name: s.name,
                file: null,
            }));
            setFormData(parsedDraft);
        } else {
            setFormData({
                titulo: '',
                descricao: '',
                tipoTeste: 'FUNCIONAL',
                prioridade: 'MEDIA',
                id_userCriacao: uuidv4(),
                idResponsavel: '',
                tempoEstimado: '',
                steps: '',
                resultadoEsperado: '',
                requisitoVinculado: '',
                status: 'NAO_INICIADO',
                comentarios: [{ idUsuario: uuidv4(), comentario: 'Observação inicial (mock)', data: new Date() }],
                anexos: ['http://example.com/image.png'],
                scripts: [],
            });
        }
    }
  }, [editId]);

  const handleChange =
    (field: keyof Omit<TestFormData, 'scripts' | 'comentarios' | 'anexos'>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    <K extends keyof TestFormData>(prop: K) =>
    (
      event: SelectChangeEvent<
        TestFormData[K] extends string ? TestFormData[K] : string
      >,
    ) => {
      const newValue = event.target.value as TestFormData[K];
      setFormData((prev) => ({
        ...prev,
        [prop]: newValue,
      }));
    };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        idUsuario: uuidv4(),
        comentario: newComment,
        data: new Date(),
      };
      setFormData((prev) => ({
        ...prev,
        comentarios: [...prev.comentarios, comment],
      }));
      setNewComment('');
    }
  };

  const removeComment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      comentarios: prev.comentarios.filter((_, i) => i !== index),
    }));
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData((prev) => ({
        ...prev,
        anexos: [...prev.anexos, newAttachment],
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => {
      const updatedAttachments = [...prev.anexos];
      updatedAttachments.splice(index, 1);
      return { ...prev, anexos: updatedAttachments };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const newScripts: ScriptFile[] = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file: file, // Aqui continua sendo o objeto File real
      }));

      setFormData((prev) => ({
        ...prev,
        scripts: [...prev.scripts, ...newScripts],
      }));
    }
  };

  const removeScript = (index: number) => {
    setFormData((prev) => {
      const updatedScripts = [...prev.scripts];
      if (updatedScripts[index]?.url) {
        URL.revokeObjectURL(updatedScripts[index].url);
      }
      updatedScripts.splice(index, 1);
      return { ...prev, scripts: updatedScripts };
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const testCaseToSave = { ...formData, id: formData.id || uuidv4() };

    const existingTestCases = JSON.parse(
      localStorage.getItem('testCases') || '[]',
    );

    let updatedTestCases;
    if (testCaseToSave.id) {
      const index = existingTestCases.findIndex(
        (tc: TestFormData) => tc.id === testCaseToSave.id,
      );
      if (index > -1) {
        updatedTestCases = [...existingTestCases];
        updatedTestCases[index] = testCaseToSave;
      } else {
        updatedTestCases = [...existingTestCases, testCaseToSave];
      }
    } else {
      updatedTestCases = [...existingTestCases, testCaseToSave];
    }

    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
    localStorage.removeItem('testCaseFormDraft');

    alert('Caso de teste salvo com sucesso!');
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    addComment,
    removeComment,
    addAttachment,
    removeAttachment,
    handleFileChange,
    removeScript,
    handleSubmit,
    newComment,
    setNewComment,
    newAttachment,
    setNewAttachment,
  };
}

export default TestCaseFormFunctions;