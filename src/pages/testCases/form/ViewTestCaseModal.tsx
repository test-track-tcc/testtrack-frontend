import { useEffect, useState } from 'react';
import { Modal, Box, Typography, CircularProgress, Alert, Paper, Divider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { TestCaseService } from '../../../services/TestCaseService';
import { type TestCase } from '../../../types/TestCase';
import { format } from 'date-fns';

const style = {
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

// Função para formatar a data para exibição
const formatDateForDisplay = (dateString?: string | Date | null) => {
    if (!dateString) return '---';
    // O ajuste de fuso horário é crucial para exibir a data correta
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + timezoneOffset);
    return format(localDate, 'dd/MM/yyyy');
};

interface ViewTestCaseModalProps {
  open: boolean;
  testCaseId: string;
  handleClose: () => void;
}

// Componente auxiliar para exibir um campo de detalhe
const DetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <Box mb={2}>
    <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 'bold' }}>{label}</Typography>
    <Typography variant="body1" sx={{ pl: 1 }}>{value || '---'}</Typography>
  </Box>
);

export default function ViewTestCaseModal({ open, testCaseId, handleClose }: ViewTestCaseModalProps) {
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && testCaseId) {
      const fetchTestCase = async () => {
        setLoading(true);
        setError('');
        try {
          const data = await TestCaseService.getById(testCaseId);
          setTestCase(data);
        } catch (err) {
          setError('Falha ao carregar os detalhes do caso de teste.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTestCase();
    }
  }, [open, testCaseId]);

  const getTestTypeDisplay = () => {
    if (!testCase) return '---';
    return testCase.customTestType ? `${testCase.customTestType.name} (Personalizado)` : testCase.testType;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {loading && <CircularProgress sx={{ margin: 'auto' }} />}
        {error && <Alert severity="error">{error}</Alert>}
        
        {testCase && !loading && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2">
                    {`[${testCase.project.prefix}-${testCase.projectSequenceId}] - ${testCase.title}`}
                </Typography>
                <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflowY: 'auto', p: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 4 }}>
                {/* PAINEL ESQUERDO */}
                <Box>
                    <DetailItem label="Projeto" value={testCase.project.name} />
                    <DetailItem label="Status" value={testCase.status.replace(/_/g, ' ')} />
                    <DetailItem label="Prioridade" value={testCase.priority} />
                    <DetailItem label="Tipo de Teste" value={getTestTypeDisplay()} />
                    <DetailItem label="Responsável" value={testCase.responsible?.name} />
                    <DetailItem label="Criado por" value={testCase.createdBy.name} />
                    <Divider sx={{ my: 1 }} />
                    <DetailItem label="Tempo Estimado" value={testCase.estimatedTime} />
                    <DetailItem label="Tempo Gasto" value={testCase.timeSpent} />
                    <DetailItem label="Data de Execução" value={formatDateForDisplay(testCase.executionDate)} />
                    <Divider sx={{ my: 1 }} />
                    <DetailItem label="Criado em" value={formatDateForDisplay(testCase.createdAt)} />
                    <DetailItem label="Última Atualização" value={formatDateForDisplay(testCase.updatedAt)} />
                </Box>

                {/* PAINEL DIREITO */}
                <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Descrição</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9' }}>{testCase.description || 'Nenhuma descrição fornecida.'}</Paper>
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Passos para Execução</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9' }}>{testCase.steps}</Paper>
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Resultado Esperado</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9' }}>{testCase.expectedResult}</Paper>

                    <DetailItem label="Link da Tarefa/Requisito" value={testCase.taskLink} />

                    {testCase.scripts && testCase.scripts.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Scripts</Typography>
                        <Paper variant="outlined" sx={{ p: 1 }}>
                            <List dense>
                                {testCase.scripts.map((script: any) => (
                                <ListItem key={script.id} secondaryAction={
                                    <IconButton edge="end" href={`${import.meta.env.VITE_API_BASE_URL}/${script.scriptPath}`} target="_blank" title="Baixar script">
                                        <FileDownloadIcon />
                                    </IconButton>
                                }>
                                    <ListItemText primary={script.scriptPath.split(/[\\/]/).pop()} secondary={`Versão: ${script.version}`} />
                                </ListItem>
                                ))}
                            </List>
                        </Paper>
                      </>
                    )}
                </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}