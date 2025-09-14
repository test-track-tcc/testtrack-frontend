import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  type SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type User } from '../../../types/User';
import { TestType, Priority, TestCaseStatus } from '../../../types/TestCase';
import { TestCaseService } from '../../../services/TestCaseService';
import { OrganizationService } from '../../../services/OrganizationService';
import { CustomTestTypeService } from '../../../services/CustomTypeService';
import { type CustomTestType } from '../../../types/CustomTestType';
import ScriptDropzone from '../../../components/common/ScriptDropzone';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(600px, 80vw, 1200px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
};

interface CreateTestCaseModalProps {
  open: boolean;
  projectId: string;
  projectName?: string;
  organizationId: string;
  handleClose: () => void;
  onSaveSuccess: () => void;
}

export default function CreateTestCaseModal({ open, projectId, projectName, organizationId, handleClose, onSaveSuccess }: CreateTestCaseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testType: '',
    priority: '',
    responsibleId: '',
    estimatedTime: '',
    steps: '',
    expectedResult: '',
    status: TestCaseStatus.NAO_INICIADO,
  });
  const [scriptFiles, setScriptFiles] = useState<File[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [customTestTypes, setCustomTestTypes] = useState<CustomTestType[]>([]);
  const [combinedTestTypes, setCombinedTestTypes] = useState<{ value: string; label: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Efeito para buscar usuários e tipos de teste da organização
  useEffect(() => {
    if (open && organizationId) {
      Promise.all([
        OrganizationService.getUsers(organizationId),
        CustomTestTypeService.findAllByOrg(organizationId)
      ])
      .then(([users, customTypes]) => {
        setOrganizationUsers(users);
        if (Array.isArray(customTypes)) {
          setCustomTestTypes(customTypes);
        }
      })
      .catch(() => setError('Não foi possível carregar os dados da organização.'));
    }
  }, [open, organizationId]);

  // Efeito para unir os tipos de teste (padrão + personalizados)
  useEffect(() => {
    const standardTypes = Object.values(TestType).map(t => ({ value: t, label: t.replace(/_/g, ' ') }));
    const customTypesFormatted = customTestTypes.map(ct => ({ value: ct.id, label: `${ct.name} (Personalizado)` }));
    setCombinedTestTypes([...standardTypes, ...customTypesFormatted]);
  }, [customTestTypes]);


  // Efeito para limpar o formulário ao fechar o modal
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '', description: '', testType: '', priority: '',
        responsibleId: '', estimatedTime: '', steps: '',
        expectedResult: '', status: TestCaseStatus.NAO_INICIADO,
      });
      setScriptFiles([]);
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const userDataString = localStorage.getItem('userData');
    const createdById = userDataString ? JSON.parse(userDataString).id : null;
    if (!createdById) {
      setError("Usuário criador não identificado. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const isCustomType = customTestTypes.some(ct => ct.id === formData.testType);

      const payload = {
        projectId,
        title: formData.title,
        description: formData.description,
        testType: isCustomType ? null : (formData.testType as TestType),
        customTestTypeId: isCustomType ? formData.testType : null,
        priority: formData.priority as Priority,
        responsibleId: formData.responsibleId || undefined,
        estimatedTime: formData.estimatedTime,
        steps: formData.steps,
        expectedResult: formData.expectedResult,
        status: formData.status as TestCaseStatus,
        createdById,
        scripts: scriptFiles,
      };

      await TestCaseService.create(payload);
      onSaveSuccess();
      handleClose();
    } catch (err) {
      setError('Falha ao salvar. Verifique se todos os campos obrigatórios estão preenchidos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSave}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">Novo Caso de Teste</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ overflowY: 'auto', p: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 4 }}>
          {/* PAINEL ESQUERDO */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>Projeto</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{projectName}</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Teste</InputLabel>
              <Select name="testType" label="Tipo de Teste" value={formData.testType} onChange={handleChange} required>
                {combinedTestTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" label="Status" value={formData.status} onChange={handleChange}>
                {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>)}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Responsável</InputLabel>
              <Select name="responsibleId" label="Responsável" value={formData.responsibleId} onChange={handleChange}>
                <MenuItem value=""><em>Nenhum</em></MenuItem>
                {organizationUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Prioridade</InputLabel>
              <Select name="priority" label="Prioridade" value={formData.priority} onChange={handleChange} required>
                {Object.values(Priority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
            
            <TextField name="estimatedTime" label="Estimativa (ex: 2h 30m)" fullWidth sx={{ mb: 2 }} value={formData.estimatedTime} onChange={handleChange} autoComplete='off' />
            <TextField name="timeSpent" label="Horas Gastas" fullWidth sx={{ mb: 2 }} value={"0h"} disabled />
          </Box>
          
          {/* PAINEL DIREITO */}
          <Box>
            <TextField name="title" label="Título do Caso de Teste" fullWidth required sx={{ mb: 2 }} value={formData.title} onChange={handleChange} />
            <TextField name="description" label="Descrição" multiline rows={4} fullWidth sx={{ mb: 2 }} value={formData.description} onChange={handleChange} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField name="steps" label="Passos para execução (Steps)" multiline rows={4} fullWidth required value={formData.steps} onChange={handleChange} />
              <TextField name="expectedResult" label="Resultado Esperado" multiline rows={4} fullWidth required value={formData.expectedResult} onChange={handleChange} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Scripts de Teste</Typography>
            <ScriptDropzone files={scriptFiles} onFilesChange={setScriptFiles} />
          </Box>
        </Box>
        
        <Divider sx={{ mt: 2 }} />
        <Box sx={{ flexShrink: 0 }}>
          {error && <Alert severity="error" sx={{ mb: 2, width: 'fit-content', mx: 'auto' }}>{error}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={handleClose} variant="outlined">Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Salvar Caso de Teste'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}