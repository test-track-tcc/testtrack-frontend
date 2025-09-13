import { useEffect, useState } from 'react';
import { Modal, Box, Typography, CircularProgress, Alert, Paper, Grid, Divider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { TestCaseService } from '../../../services/TestCaseService';
import { type TestCase } from '../../../types/TestCase';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(500px, 70vw, 900px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

interface ViewTestCaseModalProps {
  open: boolean;
  testCaseId: string;
  handleClose: () => void;
}

// Componente auxiliar para exibir um campo
const DetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
  // CORREÇÃO: A propriedade 'item' foi removida.
  // As propriedades 'xs' e 'sm' são suficientes para o MUI entender que este é um item de grid.
  <Grid>
    <Typography variant="caption" color="text.secondary" component="div">{label}</Typography>
    <Typography variant="body1">{value || '---'}</Typography>
  </Grid>
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {loading && <CircularProgress sx={{ margin: 'auto' }} />}
        {error && <Alert severity="error">{error}</Alert>}
        
        {testCase && !loading && (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              {`[${testCase.project.prefix}-${testCase.projectSequenceId}] - ${testCase.title}`}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <DetailItem label="Status" value={testCase.status} />
              <DetailItem label="Prioridade" value={testCase.priority} />
              <DetailItem label="Tipo de Teste" value={testCase.testType} />
              <DetailItem label="Responsável" value={testCase.responsible?.name} />
              <DetailItem label="Criado por" value={testCase.createdBy.name} />
              <DetailItem label="Tempo Estimado" value={testCase.estimatedTime} />
            </Grid>
            
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>Descrição</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap' }}>{testCase.description}</Paper>
            
            <Typography variant="subtitle1" gutterBottom>Passos para Execução</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap' }}>{testCase.steps}</Paper>
            
            <Typography variant="subtitle1" gutterBottom>Resultado Esperado</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap' }}>{testCase.expectedResult}</Paper>

            {testCase.scripts && testCase.scripts.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>Scripts</Typography>
                <List dense>
                  {testCase.scripts.map((script: any) => (
                    <ListItem key={script.id} secondaryAction={
                      <IconButton edge="end" href={`${import.meta.env.VITE_API_BASE_URL}/${script.scriptPath}`} target="_blank">
                        <FileDownloadIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={script.scriptPath.split(/[\\/]/).pop()} secondary={`Versão: ${script.version}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}