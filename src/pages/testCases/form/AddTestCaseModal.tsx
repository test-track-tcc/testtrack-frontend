import { useState, useEffect } from 'react';
import { Modal, Box, Button, MenuItem, Select, TextField, FormControl, InputLabel, Typography, CircularProgress, Alert } from '@mui/material';
import { TestType, Priority, TestCaseStatus } from '../../../types/TestCase';
import { type User } from '../../../types/User';
import { TestCaseService } from '../../../services/TestCaseService';
import { type CreateTestCasePayload } from '../../../types/TestCase';
import { OrganizationService } from '../../../services/OrganizationService';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(400px, 60vw, 800px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

interface AddTestCaseModalProps {
  open: boolean;
  projectId: string;
  organizationId: string;
  handleClose: () => void;
  onSaveSuccess: () => void;
}

export default function AddTestCaseModal({ open, projectId, organizationId, handleClose, onSaveSuccess }: AddTestCaseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: '',
    priority: '',
    idResponsible: '',
    timeEstimated: '',
    timeSpent: '',
    status: TestCaseStatus.PENDENTE,
    steps: '',
    expectedResult: '',
    taskLink: '',
  });

  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [scripts, setScripts] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && organizationId) {
      const fetchUsers = async () => {
        try {
          const users = await OrganizationService.getUsers(organizationId);
          setOrganizationUsers(users);
        } catch (err) {
          console.error("Falha ao buscar usuários da organização", err);
        }
      };
      fetchUsers();
    }
  }, [open, organizationId]);

  const handleChange = (event: any) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setScripts(Array.from(event.target.files));
    }
  };

  const clearForm = () => {
    setFormData({
      title: '', description: '', testType: '', priority: '', idResponsible: '',
      timeEstimated: '', timeSpent: '', status: TestCaseStatus.PENDENTE, steps: '',
      expectedResult: '', taskLink: ''
    });
    setScripts([]);
    setError('');
  };

  const handleSave = async () => {
    setError('');
    const userDataString = localStorage.getItem('userData');
    const idCreatedBy = userDataString ? JSON.parse(userDataString).id : null;

    if (!idCreatedBy) {
      setError("Usuário criador não identificado. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);
    const payload: CreateTestCasePayload = {
      ...formData,
      projectId: projectId,
      idCreatedBy: idCreatedBy,
      scripts: scripts,
    };

    try {
      await TestCaseService.create(payload);
      clearForm();
      handleClose();
      onSaveSuccess();
    } catch (err) {
      setError('Falha ao salvar o caso de teste. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Typography variant="h5" component="h2">Novo Caso de Teste</Typography>

        <TextField name="title" label="Título" value={formData.title} onChange={handleChange} required autoComplete='off' />
        <TextField name="description" label="Descrição" value={formData.description} onChange={handleChange} multiline rows={3} autoComplete='off' />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Teste</InputLabel>
            <Select name="testType" label="Tipo de Teste" value={formData.testType} onChange={handleChange}>
              {Object.values(TestType).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Prioridade</InputLabel>
            <Select name="priority" label="Prioridade" value={formData.priority} onChange={handleChange}>
              {Object.values(Priority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" label="Status" value={formData.status} onChange={handleChange}>
            {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Responsável (Opcional)</InputLabel>
          <Select name="idResponsible" label="Responsável (Opcional)" value={formData.idResponsible} onChange={handleChange}>
            <MenuItem value=""><em>Nenhum</em></MenuItem>
            {organizationUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
          </Select>
        </FormControl>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField name="timeEstimated" label="Tempo Estimado (ex: 2h 30m)" value={formData.timeEstimated} onChange={handleChange} />
          <TextField name="timeSpent" label="Tempo Gasto" value={formData.timeSpent} onChange={handleChange} helperText="Atualizado durante a execução" />
        </Box>

        <TextField name="steps" label="Passos (Steps)" value={formData.steps} onChange={handleChange} multiline rows={3} required autoComplete='off' />
        <TextField name="expectedResult" label="Resultado Esperado" value={formData.expectedResult} onChange={handleChange} multiline rows={3} required autoComplete='off' />
        <TextField name="taskLink" label="Vincular Requisito/Task (Opcional)" value={formData.taskLink} onChange={handleChange} autoComplete='off' />

        <Button variant="outlined" component="label">
          Upload de Scripts
          <input type="file" hidden multiple onChange={handleFileChange} />
        </Button>
        {scripts.length > 0 && <Typography variant="body2" color="text.secondary">{scripts.length} arquivo(s) selecionado(s).</Typography>}

        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}