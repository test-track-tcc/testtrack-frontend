import { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, CircularProgress, Divider, Chip, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { type TestCase as TestCaseType } from '../../../types/TestCase';
import { TestCaseService } from '../../../services/TestCaseService';

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

interface TestCaseDetailModalProps {
  open: boolean;
  testCaseId: string | null;
  handleClose: () => void;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box mb={2}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default function TestCaseDetailModal({ open, testCaseId, handleClose }: TestCaseDetailModalProps) {
  const [testCase, setTestCase] = useState<TestCaseType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && testCaseId) {
      const fetchTestCase = async () => {
        setLoading(true);
        try {
          const data = await TestCaseService.getById(testCaseId);
          setTestCase(data);
        } catch (error) {
          console.error("Erro ao carregar detalhes do caso de teste:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTestCase();
    }
  }, [open, testCaseId]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {loading || !testCase ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* CABEÇALHO */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Chip label={`${testCase.project.prefix}-${testCase.projectSequenceId}`} color="primary" />
                <Typography variant="h5" component="h2">{testCase.title}</Typography>
                <IconButton size="small"><EditIcon /></IconButton>
                <IconButton size="small"><DeleteIcon /></IconButton>
              </Box>
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Criado por {testCase.createdBy.name} em {formatDate(testCase.createdAt)}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* CORPO */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 3, overflowY: 'auto' }}>
              {/* PAINEL ESQUERDO */}
              <Box>
                <DetailItem label="Projeto" value={testCase.project.name} />
                <DetailItem label="Teste Automatizado" value={testCase.testType} />
                <DetailItem label="Status" value={<Chip label={testCase.status} color="info" size="small" />} />
                <DetailItem label="Responsável" value={testCase.responsible?.name || 'Nenhum'} />
                <DetailItem label="Prioridade" value={<Chip label={testCase.priority} color="warning" size="small" />} />
                <DetailItem label="Estimativa de Tempo" value={testCase.timeEstimated || 'N/A'} />
                <DetailItem label="Horas Gastas" value={testCase.timeSpent || 'N/A'} />
              </Box>

              {/* PAINEL DIREITO */}
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>{testCase.description}</Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Steps</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{testCase.steps}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Resultado Esperado</Typography>
                    <Typography variant="body2">{testCase.expectedResult}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Scripts</Typography>
                {testCase.scripts?.map((script, index) => (
                    <Box key={index} display="flex" alignItems="center" justifyContent="space-between" p={1} sx={{backgroundColor: '#f5f5f5', borderRadius: 1, mb: 1}}>
                       <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircleIcon color="success" /> 
                          <Typography variant="body2">{script.split('/').pop()}</Typography>
                       </Box>
                       <IconButton size="small"><DownloadIcon /></IconButton>
                    </Box>
                ))}
                <Box sx={{ border: '2px dashed #ccc', padding: 4, borderRadius: 2, textAlign: 'center', mt: 2 }}>
                    <Typography color="text.secondary">Arraste e solte um script aqui ou clique para fazer upload</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>Comentários</Typography>
                <TextField fullWidth multiline rows={3} placeholder="Escreva um comentário, ou mencione um usuário da organização" />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}