import { useState, useEffect } from 'react';
import { Modal, Box, Button, MenuItem, Select, TextField, FormControl, InputLabel, Typography, CircularProgress, Alert, type SelectChangeEvent } from '@mui/material';
import { TestType, Priority, TestCaseStatus } from '../../../types/TestCase';
import { type User } from '../../../types/User';
import { TestCaseService } from '../../../services/TestCaseService';
import { OrganizationService } from '../../../services/OrganizationService';
import { type UpdateTestCasePayload } from '../../../types/TestCase';
import ScriptDropzone from '../../../components/common/ScriptDropzone';

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

interface EditTestCaseModalProps {
  open: boolean;
  testCaseId: string;
  organizationId: string; // <-- 1. ADICIONADA NOVA PROP
  handleClose: () => void;
  onSaveSuccess: () => void;
}

export default function EditTestCaseModal({ open, testCaseId, organizationId, handleClose, onSaveSuccess }: EditTestCaseModalProps) {
  const [formData, setFormData] = useState<Partial<UpdateTestCasePayload>>({});
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [scripts, setScripts] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const tipos = Object.values(TestType);
  const prioridades = Object.values(Priority);
  const statusList = Object.values(TestCaseStatus);

  useEffect(() => {
    if (open && testCaseId) {
      const fetchInitialData = async () => {
        setLoading(true);
        setError('');
        try {
          const testCaseData = await TestCaseService.getById(testCaseId);
          setFormData({
            title: testCaseData.title,
            description: testCaseData.description,
            testType: testCaseData.testType,
            priority: testCaseData.priority,
            responsibleId: testCaseData.responsible?.id || '',
            estimatedTime: testCaseData.estimatedTime || '',
            steps: testCaseData.steps,
            expectedResult: testCaseData.expectedResult,
            taskLink: testCaseData.taskLink || '',
            status: testCaseData.status,
          });
          
          // --- 2. CORREÇÃO: Usar a prop organizationId diretamente ---
          if (organizationId) {
            const users = await OrganizationService.getUsers(organizationId);
            setOrganizationUsers(users);
          }

        } catch (err) {
          setError("Falha ao carregar dados do caso de teste.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [open, testCaseId, organizationId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSelectChange = (name: keyof typeof formData) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [name]: event.target.value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload: UpdateTestCasePayload = {
      ...formData,
      scripts: scripts.length > 0 ? scripts : undefined, 
    };

    try {
      await TestCaseService.update(testCaseId, payload);
      handleClose();
      onSaveSuccess();
    } catch (err) {
      setError('Falha ao atualizar o caso de teste. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}><CircularProgress sx={{ margin: 'auto' }} /></Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSave}>
        <Typography variant="h5" component="h2">Editar Caso de Teste</Typography>
        
        <TextField name="title" label="Título" value={formData.title || ''} onChange={handleChange} required autoComplete='off' />
        <TextField name="description" label="Descrição" value={formData.description || ''} onChange={handleChange} multiline rows={3} autoComplete='off' />
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Teste</InputLabel>
            <Select name="testType" label="Tipo de Teste" value={formData.testType || ''} onChange={handleSelectChange('testType')}>
              {tipos.map(t => <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Prioridade</InputLabel>
            <Select name="priority" label="Prioridade" value={formData.priority || ''} onChange={handleSelectChange('priority')}>
              {prioridades.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" label="Status" value={formData.status || ''} onChange={handleSelectChange('status')}>
            {statusList.map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Responsável (Opcional)</InputLabel>
          <Select name="responsibleId" label="Responsável (Opcional)" value={formData.responsibleId || ''} onChange={handleSelectChange('responsibleId')}>
            <MenuItem value=""><em>Nenhum</em></MenuItem>
            {organizationUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField name="estimatedTime" label="Tempo Estimado (ex: 2h 30m)" value={formData.estimatedTime || ''} onChange={handleChange} />
        
        <TextField name="steps" label="Passos (Steps)" value={formData.steps || ''} onChange={handleChange} multiline rows={3} required autoComplete='off' />
        <TextField name="expectedResult" label="Resultado Esperado" value={formData.expectedResult || ''} onChange={handleChange} multiline rows={3} required autoComplete='off' />
        <TextField name="taskLink" label="Vincular Requisito/Task (Opcional)" value={formData.taskLink || ''} onChange={handleChange} autoComplete='off' />

        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: 'medium' }}>Adicionar Novos Scripts</Typography>
        <ScriptDropzone files={scripts} onFilesChange={setScripts} />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}