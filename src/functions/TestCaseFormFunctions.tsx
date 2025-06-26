import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type SelectChangeEvent } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { getTestCaseById, createTestCase, updateTestCase } from '../api/testCases';
import {type TestFormData, type Comment, type ScriptFile } from '../types/TestCase';

function TestCaseFormFunctions() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('id');

  const [formData, setFormData] = useState<TestFormData>({
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
    comentarios: [],
    anexos: [],
    scripts: [],
  });

  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  useEffect(() => {
    const fetchTestCase = async () => {
      if (editId) {
        try {
          const data = await getTestCaseById(editId);
          setFormData(data);
        } catch (error) {
          console.error('Erro ao buscar caso de teste:', error);
        }
      }
    };

    fetchTestCase();
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
    (event: SelectChangeEvent<string>) => {
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

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData((prev) => ({
        ...prev,
        anexos: [...prev.anexos, newAttachment],
      }));
      setNewAttachment('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newScripts: ScriptFile[] = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
      }));
      setFormData((prev) => ({
        ...prev,
        scripts: [...prev.scripts, ...newScripts],
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editId) {
        await updateTestCase(editId, formData);
      } else {
        await createTestCase(formData);
      }
      console.log('Caso de teste salvo com sucesso!');
      navigate('/testCase');
    } catch (error) {
      console.error('Erro ao salvar caso de teste:', error);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    addComment,
    setNewComment,
    newComment,
    addAttachment,
    setNewAttachment,
    newAttachment,
    handleFileChange,
    handleSubmit,
  };
}

export default TestCaseFormFunctions;
