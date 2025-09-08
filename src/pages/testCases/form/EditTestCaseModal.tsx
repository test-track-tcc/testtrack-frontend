import { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, FormControl, InputLabel, Typography, CircularProgress, Alert, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { type User } from '../../../types/User';
import { TestCaseStatus, type UpdateTestCasePayload } from '../../../types/TestCase';
import { TestCaseService } from '../../../services/TestCaseService';
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

// 1. Defina um tipo para o estado do formulário
interface EditFormState {
  title: string;
  description: string;
  responsibleId: string;
  status: TestCaseStatus | '';
  // Adicione outros campos do formulário aqui
}

interface EditTestCaseModalProps {
  open: boolean;
  testCaseId: string | null;
  handleClose: () => void;
  onSaveSuccess: () => void;
}

export default function EditTestCaseModal({ open, testCaseId, handleClose, onSaveSuccess }: EditTestCaseModalProps) {
  // 2. Use o novo tipo para o estado do formulário
  const [formData, setFormData] = useState<EditFormState>({
    title: '',
    description: '',
    responsibleId: '',
    status: '',
  });
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && testCaseId) {
      const fetchInitialData = async () => {
        try {
          setLoading(true);
          setError('');
          const testCaseData = await TestCaseService.getById(testCaseId);
          
          // 3. Popule o estado do formulário corretamente
          setFormData({
            title: testCaseData.title || '',
            description: testCaseData.description || '',
            responsibleId: testCaseData.responsible?.id || '', // Pega o ID do objeto
            status: testCaseData.status || '',
          });

          if (testCaseData.project?.organization?.id) {
            const users = await OrganizationService.getUsers(testCaseData.project.organization.id);
            setOrganizationUsers(users);
          }
        } catch (err) {
          setError('Falha ao carregar os dados do caso de teste.');
        } finally {
          setLoading(false);
        }
      };
      fetchInitialData();
    }
  }, [open, testCaseId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!testCaseId) return;

    setIsSubmitting(true);
    setError('');

    try {
      const payload: UpdateTestCasePayload = {
        title: formData.title,
        description: formData.description,
        responsibleId: formData.responsibleId || undefined,
        status: formData.status as TestCaseStatus,
      };
      await TestCaseService.update(testCaseId, payload);
      handleClose();
      onSaveSuccess();
    } catch (err) {
      setError('Falha ao atualizar o caso de teste.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSave}>
        <Typography variant="h5">Editar Caso de Teste</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField name="title" label="Título" value={formData.title} onChange={handleChange} required />
            <TextField name="description" label="Descrição" value={formData.description} onChange={handleChange} multiline rows={3} />
            <FormControl fullWidth>
              <InputLabel>Responsável</InputLabel>
              <Select name="responsibleId" label="Responsável" value={formData.responsibleId} onChange={handleChange}>
                <MenuItem value=""><em>Nenhum</em></MenuItem>
                {organizationUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" label="Status" value={formData.status} onChange={handleChange}>
                    {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
            </FormControl>
            
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : 'Salvar Alterações'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}