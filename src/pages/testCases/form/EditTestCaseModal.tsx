import { useState, useEffect } from 'react';
import {
    Modal, Box, Button, MenuItem, Select, TextField, FormControl,
    InputLabel, Typography, CircularProgress, Alert, type SelectChangeEvent,
    IconButton, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TestType, Priority, TestCaseStatus } from '../../../types/TestCase';
import { type User } from '../../../types/User';
import { TestCaseService } from '../../../services/TestCaseService';
import { OrganizationService } from '../../../services/OrganizationService';
import { CustomTestTypeService } from '../../../services/CustomTypeService';
import { type CustomTestType } from '../../../types/CustomTestType';
import { type UpdateTestCasePayload, type TestCase } from '../../../types/TestCase';
import ScriptDropzone from '../../../components/common/ScriptDropzone';
import { format } from 'date-fns';

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

const formatDateForInput = (dateString?: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + timezoneOffset);
    return format(localDate, 'yyyy-MM-dd');
};

interface EditTestCaseModalProps {
    open: boolean;
    testCaseId: string;
    organizationId: string;
    handleClose: () => void;
    onSaveSuccess: () => void;
}

export default function EditTestCaseModal({ open, testCaseId, organizationId, handleClose, onSaveSuccess }: EditTestCaseModalProps) {
    const [formData, setFormData] = useState<Partial<UpdateTestCasePayload>>({});
    const [testCaseData, setTestCaseData] = useState<TestCase | null>(null);
    const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
    const [customTestTypes, setCustomTestTypes] = useState<CustomTestType[]>([]);
    const [combinedTestTypes, setCombinedTestTypes] = useState<{ value: string; label: string }[]>([]);
    const [scripts, setScripts] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && testCaseId && organizationId) {
            const fetchInitialData = async () => {
                setLoading(true);
                setError('');
                try {
                    const [fetchedTestCaseData, users, customTypes] = await Promise.all([
                        TestCaseService.getById(testCaseId),
                        OrganizationService.getUsers(organizationId),
                        CustomTestTypeService.findAllByOrg(organizationId)
                    ]);

                    setTestCaseData(fetchedTestCaseData);
                    setFormData({
                        title: fetchedTestCaseData.title,
                        description: fetchedTestCaseData.description,
                        testType: (fetchedTestCaseData.customTestType ? fetchedTestCaseData.customTestType.id : fetchedTestCaseData.testType ?? '') as any,
                        priority: fetchedTestCaseData.priority,
                        responsibleId: fetchedTestCaseData.responsible?.id || '',
                        status: fetchedTestCaseData.status,
                        steps: fetchedTestCaseData.steps,
                        expectedResult: fetchedTestCaseData.expectedResult,
                        taskLink: fetchedTestCaseData.taskLink || '',
                        estimatedTime: fetchedTestCaseData.estimatedTime || '',
                        timeSpent: fetchedTestCaseData.timeSpent || '',
                        executionDate: formatDateForInput(fetchedTestCaseData.executionDate),
                    });

                    setOrganizationUsers(users);
                    if (Array.isArray(customTypes)) {
                        setCustomTestTypes(customTypes);
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

    useEffect(() => {
        const standardTypes = Object.values(TestType).map(t => ({ value: t, label: t.replace(/_/g, ' ') }));
        const customTypesFormatted = customTestTypes.map(ct => ({ value: ct.id, label: `${ct.name} (Personalizado)` }));
        setCombinedTestTypes([...standardTypes, ...customTypesFormatted]);
    }, [customTestTypes]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        const isCustomType = customTestTypes.some(ct => ct.id === formData.testType);

        const payload: UpdateTestCasePayload = {
            ...formData,
            testType: isCustomType ? null : (formData.testType as TestType),
            customTestTypeId: isCustomType ? formData.testType : null,
            scripts: scripts.length > 0 ? scripts : undefined,
            executionDate: formData.executionDate || null,
        };

        try {
            await TestCaseService.update(testCaseId, payload);
            onSaveSuccess();
            handleClose();
        } catch (err) {
            setError('Falha ao atualizar o caso de teste. Verifique os dados e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Modal open={open}>
                <Box sx={modalStyle}><CircularProgress sx={{ margin: 'auto' }} /></Box>
            </Modal>
        );
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSave}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">Editar Caso de Teste</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ overflowY: 'auto', p: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 4 }}>
                    {/* PAINEL ESQUERDO */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>Projeto</Typography>
                            <Typography variant="body1">{testCaseData?.project?.name}</Typography>
                        </Box>

                        <FormControl fullWidth>
                            <InputLabel>Tipo de Teste</InputLabel>
                            <Select name="testType" label="Tipo de Teste" value={formData.testType || ''} onChange={handleChange} required>
                                {combinedTestTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select name="status" label="Status" value={formData.status || ''} onChange={handleChange}>
                                {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Responsável</InputLabel>
                            <Select name="responsibleId" label="Responsável" value={formData.responsibleId || ''} onChange={handleChange}>
                                <MenuItem value=""><em>Nenhum</em></MenuItem>
                                {organizationUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Prioridade</InputLabel>
                            <Select name="priority" label="Prioridade" value={formData.priority || ''} onChange={handleChange} required>
                                {Object.values(Priority).map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <TextField name="estimatedTime" label="Estimativa (ex: 2h 30m)" fullWidth value={formData.estimatedTime || ''} onChange={handleChange} autoComplete='off' />
                        <TextField name="timeSpent" label="Tempo Gasto (ex: 1h 45m)" fullWidth value={formData.timeSpent || ''} onChange={handleChange} autoComplete='off' />
                        <TextField name="executionDate" label="Data de Execução" type="date" fullWidth value={formData.executionDate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    </Box>

                    {/* PAINEL DIREITO */}
                    <Box>
                        <TextField name="title" label="Título do Caso de Teste" fullWidth required sx={{ mb: 2 }} value={formData.title || ''} onChange={handleChange} />
                        <TextField name="description" label="Descrição" multiline rows={4} fullWidth sx={{ mb: 2 }} value={formData.description || ''} onChange={handleChange} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                            <TextField name="steps" label="Passos para execução (Steps)" multiline rows={4} fullWidth required value={formData.steps || ''} onChange={handleChange} />
                            <TextField name="expectedResult" label="Resultado Esperado" multiline rows={4} fullWidth required value={formData.expectedResult || ''} onChange={handleChange} />
                        </Box>
                        <TextField name="taskLink" label="Vincular Requisito/Task (Opcional)" fullWidth sx={{ mb: 2 }} value={formData.taskLink || ''} onChange={handleChange} autoComplete='off' />
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>Adicionar Novos Scripts</Typography>
                        <ScriptDropzone files={scripts} onFilesChange={setScripts} />
                    </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />
                <Box sx={{ flexShrink: 0 }}>
                    {error && <Alert severity="error" sx={{ mb: 2, width: 'fit-content', mx: 'auto' }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={handleClose} variant="outlined">Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Salvar Alterações'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}