import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type TestScenario, type CreateTestScenarioPayload, type UpdateTestScenarioPayload } from '../../types/TestScenario';
import { TestScenarioService } from '../../services/TestScenarioService';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(500px, 60vw, 800px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface TestScenarioModalProps {
  open: boolean;
  mode: 'create' | 'edit' | 'view';
  projectId: string;
  testScenario?: TestScenario | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const initialState = {
  identifier: '',
  name: '',
  description: '',
  objective: '',
  preconditions: '',
  acceptanceCriteria: '',
  relatedRequirements: [],
  testCaseIds: [],
};

export default function TestScenarioModal({ open, mode, projectId, testScenario, onClose, onSaveSuccess }: TestScenarioModalProps) {
  const [formData, setFormData] = useState<Omit<CreateTestScenarioPayload, 'projectId'>>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [displayIdentifier, setDisplayIdentifier] = useState('');

  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setFormData(initialState);
        setDisplayIdentifier('');
      } else {
        setFormData({
          name: testScenario?.name || '',
          description: testScenario?.description || '',
          objective: testScenario?.objective || '',
          preconditions: testScenario?.preconditions || '',
          acceptanceCriteria: testScenario?.acceptanceCriteria || '',
          relatedRequirements: testScenario?.relatedRequirements || [],
          testCaseIds: testScenario?.testCases?.map(tc => tc.id) || [],
        });
        setDisplayIdentifier(testScenario?.identifier || 'N/A');
      }
      setError('');
    }
  }, [open, mode, testScenario]);


  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      if (mode === 'create') {
        const payload: CreateTestScenarioPayload = { ...formData, projectId };
        await TestScenarioService.create(payload);
      } else if (mode === 'edit' && testScenario) {
        const payload: UpdateTestScenarioPayload = { ...formData, projectId };
        await TestScenarioService.update(testScenario.id, payload);
      }
      onSaveSuccess();
    } catch (err) {
      setError('Falha ao salvar o cenário de teste. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadonly = mode === 'view';
  const title = { create: 'Novo Cenário de Teste', edit: 'Editar Cenário de Teste', view: 'Detalhes do Cenário de Teste' }[mode];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2" sx={{fontWeight: "bold"}}>{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        
        {mode !== 'create' && (
          <TextField 
            label="Identificador" 
            value={displayIdentifier} 
            fullWidth 
            disabled
            sx={{ mb: 2 }} 
          />
        )}
        <TextField label="Nome / Título" value={formData.name} onChange={handleChange('name')} fullWidth required disabled={isReadonly} autoComplete='off' sx={{ mb: 2 }} />
        <TextField label="Objetivo" value={formData.objective} onChange={handleChange('objective')} fullWidth multiline rows={2} required disabled={isReadonly} sx={{ mb: 2 }} autoComplete='off' />
        <TextField label="Descrição" value={formData.description} onChange={handleChange('description')} fullWidth multiline rows={3} required disabled={isReadonly} sx={{ mb: 2 }} autoComplete='off' />
        <TextField label="Pré-condições" value={formData.preconditions} onChange={handleChange('preconditions')} fullWidth multiline rows={2} disabled={isReadonly} sx={{ mb: 2 }} autoComplete='off' />
        <TextField label="Critérios de Aceitação" value={formData.acceptanceCriteria} onChange={handleChange('acceptanceCriteria')} fullWidth multiline rows={2} disabled={isReadonly} sx={{ mb: 2 }} autoComplete='off' />
        <TextField label="Requisitos Relacionados (separados por vírgula)" value={formData.relatedRequirements?.join(', ')} onChange={(e) => setFormData(prev => ({...prev, relatedRequirements: e.target.value.split(',').map(s => s.trim())}))} fullWidth disabled={isReadonly} sx={{ mb: 2 }} autoComplete='off' />


        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} variant="outlined">{isReadonly ? 'Fechar' : 'Cancelar'}</Button>
          {!isReadonly && (
            <Button onClick={handleSave} variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}