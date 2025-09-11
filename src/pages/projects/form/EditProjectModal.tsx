import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Divider, IconButton, FormControl, InputLabel, Select, MenuItem, ButtonGroup, type SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type Project, type UpdateProjectPayload, ProjectStatus } from '../../../types/Project';
import { ProjectService } from '../../../services/ProjectService';
import { format } from 'date-fns';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'yyyy-MM-dd');
};

interface EditProjectModalProps {
    open: boolean;
    project: Project | null;
    handleClose: () => void;
    onSaveSuccess: () => void;
}

export default function EditProjectModal({ open, project, handleClose, onSaveSuccess }: EditProjectModalProps) {
    const [formData, setFormData] = useState<Partial<UpdateProjectPayload>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                status: project.status || ProjectStatus.NOT_STARTED,
                startDate: formatDateForInput(project.startDate),
                estimateEnd: formatDateForInput(project.estimateEnd),
                conclusionDate: formatDateForInput(project.conclusionDate),
            });
        }
    }, [project]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (name) {
            setFormData(prev => ({ ...prev, [name]: value as string }));
        }
    };
    
    const handleSave = async () => {
        if (!project) return;
        setLoading(true);
        try {
            await ProjectService.update(project.id, {
                ...formData,
                startDate: formData.startDate || undefined,
                estimateEnd: formData.estimateEnd || undefined,
                conclusionDate: formData.conclusionDate || undefined,
            });
            onSaveSuccess();
        } catch (error) {
            console.error("Erro ao atualizar projeto:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} className='add-modal' aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={style}>
                 <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"><strong>Editar Projeto</strong></Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>
                <Divider />
                <TextField name="name" label="Nome do Projeto" value={formData.name || ''} onChange={handleChange} fullWidth />
                <TextField name="description" label="Descrição" value={formData.description || ''} onChange={handleChange} multiline rows={3} fullWidth />
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status || ''} label="Status" onChange={handleChange}>
                        <MenuItem value={ProjectStatus.NOT_STARTED}>Não Iniciado</MenuItem>
                        <MenuItem value={ProjectStatus.IN_PROGRESS}>Em progresso</MenuItem>
                        <MenuItem value={ProjectStatus.FINISHED}>Concluído</MenuItem>
                        <MenuItem value={ProjectStatus.BLOCKED}>Bloqueado</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="startDate" label="Data de Início" type="date" value={formData.startDate || ''} InputLabelProps={{ shrink: true }} onChange={handleChange} fullWidth />
                <TextField name="estimateEnd" label="Previsão de Finalização" type="date" value={formData.estimateEnd || ''} InputLabelProps={{ shrink: true }} onChange={handleChange} fullWidth />
                <TextField name="conclusionDate" label="Data de Finalização" type="date" value={formData.conclusionDate || ''} InputLabelProps={{ shrink: true }} onChange={handleChange} fullWidth />
                <ButtonGroup variant="contained" className='group-btn buttons-section'>
                    <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Salvar'}
                    </Button>
                </ButtonGroup>
            </Box>
        </Modal>
    );
}