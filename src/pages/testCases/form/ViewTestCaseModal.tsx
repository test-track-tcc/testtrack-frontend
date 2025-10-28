import { useEffect, useState, useRef } from 'react';
import { 
    Modal, Box, Typography, CircularProgress, Alert, Paper, 
    Divider, List, ListItem, ListItemText, IconButton, Button, 
    TextField, Avatar 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { TestCaseService } from '../../../services/TestCaseService';
import { type TestCase, type Comment } from '../../../types/TestCase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

const formatDateForDisplay = (dateString?: string | Date | null) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + timezoneOffset);
    return format(localDate, 'dd/MM/yyyy');
};

interface ViewTestCaseModalProps {
  open: boolean;
  testCaseId: string;
  handleClose: () => void;
  onEdit: (testCaseId: string) => void;
  onDelete: (testCaseId: string) => void;
}

const DetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
  <Box mb={2}>
    <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 'bold' }}>{label}</Typography>
    <Typography variant="body1" sx={{ pl: 1 }}>{value || '---'}</Typography>
  </Box>
);

export default function ViewTestCaseModal({ open, testCaseId, handleClose, onEdit, onDelete }: ViewTestCaseModalProps) {
    const serverRootUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '')
    const [testCase, setTestCase] = useState<TestCase | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchTestCase = async () => {
        if (!testCaseId) return;
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

    useEffect(() => {
        if (open) {
            fetchTestCase();
        } else {
            setTestCase(null);
            setNewComment('');
            setEvidenceFiles([]);
        }
    }, [open, testCaseId]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setEvidenceFiles(Array.from(event.target.files));
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() && evidenceFiles.length === 0) return;
        
        const userDataString = localStorage.getItem('userData');
        const authorId = userDataString ? JSON.parse(userDataString).id : null;
        if (!authorId) {
            setError("Usuário não identificado. Faça login novamente.");
            return;
        }

        setIsSubmittingComment(true);
        try {
            const formData = new FormData();
            formData.append('text', newComment);
            formData.append('authorId', authorId);
            evidenceFiles.forEach(file => {
                formData.append('files', file);
            });

            await TestCaseService.addComment(testCaseId, formData);
            setNewComment('');
            setEvidenceFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
            await fetchTestCase();
        } catch (err) {
            setError('Falha ao adicionar o comentário.');
        } finally {
            setIsSubmittingComment(false);
        }
    };
    
    const handleEditClick = () => { if (testCase?.id) onEdit(testCase.id); };
    const handleDeleteClick = () => { if (testCase?.id) onDelete(testCase.id); };

    const getTestTypeDisplay = () => {
      if (!testCase) return '---';
      return testCase.customTestType ? `${testCase.customTestType.name} (Personalizado)` : testCase.testType;
    };
  
    const getDeviceDisplay = () => {
      if (!testCase || !testCase.targetDevice) return '---';
      if (testCase.targetDevice === 'OTHER') {
          return testCase.customTargetDevice || 'Outro (não especificado)';
      }
      return testCase.targetDevice.charAt(0).toUpperCase() + testCase.targetDevice.slice(1).toLowerCase();
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
                                <span>
                                  <span className='test-case-prefix'>{testCase.project.prefix}-{testCase.projectSequenceId} </span><strong>{testCase.title}</strong>
                                </span>
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button variant="outlined" color="info" startIcon={<EditIcon />} onClick={handleEditClick}>Editar</Button>
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteClick}>Excluir</Button>
                                <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ overflowY: 'auto', p: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 4 }}>
                            {/* PAINEL ESQUERDO */}
                            <Box>
                                <DetailItem label="Projeto" value={testCase.project.name} />
                                <DetailItem label="Cenário de Teste" value={testCase.testScenario ? `${testCase.testScenario.identifier} - ${testCase.testScenario.name}` : 'Nenhum'} />
                                <DetailItem label="Status" value={testCase.status.replace(/_/g, ' ')} />
                                <DetailItem label="Prioridade" value={testCase.priority} />
                                <DetailItem label="Responsável" value={testCase.responsible?.name} />
                                {testCase.status == "REPROVADO" &&
                                    <DetailItem 
                                        label="Desenvolvedor para correção" 
                                        value={testCase.bugResponsible ? `${testCase.bugResponsible.name} (${testCase.bugResponsible.email})` : 'Nenhum'}
                                    />
                                }
                                <DetailItem label="Tipo de Teste" value={getTestTypeDisplay()} />
                                {testCase.testType === 'FUNCIONAL' && (<DetailItem label="Framework" value={testCase.functionalFramework?.replace(/_/g, ' ')} />)}
                                <DetailItem label="Dispositivo Alvo" value={getDeviceDisplay()} />
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
                                                <IconButton
                                                    href={`${import.meta.env.VITE_API_URL}/${script.scriptPath}`} 
                                                    target="_blank" 
                                                    title="Baixar script"
                                                    download
                                                    sx={{ pointerEvents: 'auto' }}
                                                >
                                                    <FileDownloadIcon />
                                                </IconButton>
                                            }>
                                                <ListItemText 
                                                    primary={script.scriptPath.split(/[\\/]/).pop()} 
                                                    secondary={`Versão: ${script.version}`} 
                                                />
                                            </ListItem>
                                                ))}
                                            </List>
                                        </Paper>
                                    </>
                                 )}
                                
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Comentários e Evidências</Typography>
                                
                                <List sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2, p:0 }}>
                                    {testCase.comments && testCase.comments.map((comment: Comment) => (
                                        <Paper key={comment.id} elevation={0} sx={{ p: 1.5, mb: 1, border: '1px solid #eee' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                                                    {(comment.author.name?.charAt(0)) ?? '?'}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>{comment.author.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{format(new Date(comment.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{comment.text}</Typography>
                                            {comment.attachments && comment.attachments.length > 0 && (
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {comment.attachments.map((path, index) => (
                                                        <a key={index} href={`${serverRootUrl}/api/${path}`} target="_blank" rel="noopener noreferrer">
                                                            <img 
                                                                src={`${serverRootUrl}/api/${path}`} 
                                                                alt={`Evidência ${index + 1}`} 
                                                                style={{ height: '60px', width: 'auto', borderRadius: '4px', border: '1px solid #ddd', objectFit: 'cover' }} 
                                                            />
                                                        </a>
                                                    ))}
                                                </Box>
                                            )}
                                        </Paper>
                                    ))}
                                </List>

                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                                    <TextField fullWidth multiline variant="outlined" size="small" placeholder="Adicionar um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={isSubmittingComment} />
                                    <IconButton onClick={() => fileInputRef.current?.click()} disabled={isSubmittingComment}><AttachFileIcon /></IconButton>
                                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
                                    <Button variant="contained" onClick={handleAddComment} disabled={isSubmittingComment || (!newComment.trim() && evidenceFiles.length === 0)} sx={{ minWidth: 'auto', px: 2 }}>
                                        {isSubmittingComment ? <CircularProgress size={24} /> : <SendIcon />}
                                    </Button>
                                </Box>
                                {evidenceFiles.length > 0 && (<Typography variant="caption" sx={{ display: 'block', mt: 1 }}>{evidenceFiles.length} arquivo(s) selecionado(s): {evidenceFiles.map(f => f.name).join(', ')}</Typography>)}
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
}