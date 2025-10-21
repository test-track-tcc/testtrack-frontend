import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, IconButton, CircularProgress, Alert,
  Divider, Button, Select, MenuItem, FormControl, InputLabel, type SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { BugsService } from '../../../services/BugsService';
import { BugStatus, type Bug } from '../../../types/Bug';
import { format } from 'date-fns';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(500px, 70vw, 900px)',
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
  try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
  } catch {
      return 'Data inválida';
  }
};

interface ViewBugModalProps {
  open: boolean;
  bugId: string | null;
  handleClose: () => void;
  onStatusUpdated: () => void;
}

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <Box mb={1.5}>
    <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 'bold' }}>{label}</Typography>
    <Typography variant="body1" sx={{ pl: 1, whiteSpace: 'pre-wrap' }}>{value || '---'}</Typography>
  </Box>
);

export default function ViewBugModal({ open, bugId, handleClose, onStatusUpdated }: ViewBugModalProps) {
  const [bug, setBug] = useState<Bug | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BugStatus | ''>('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canEditStatus = true;

  useEffect(() => {
    setIsEditingStatus(false);

    const fetchBug = async () => {
      if (!bugId) return;
      setLoading(true);
      setError('');
      try {
        const data = await BugsService.findOne(bugId);
        setBug(data);
        setCurrentStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar detalhes do bug.');
        setBug(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchBug();
    } else {
      setBug(null);
      setCurrentStatus('');
    }
  }, [open, bugId]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setCurrentStatus(event.target.value as BugStatus);
  };

  const handleSaveChanges = async () => {
    if (!bug || !currentStatus || currentStatus === bug.status) return;
    
    setSaving(true);
    setError('');
    try {
      await BugsService.updateStatus(bug.id, currentStatus);
      onStatusUpdated();
      setIsEditingStatus(false);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar o status.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnterEditMode = () => {
      if (bug) {
          setCurrentStatus(bug.status);
          setIsEditingStatus(true);
      }
  };

  const handleCancelEditMode = () => {
      setIsEditingStatus(false);
      if (bug) {
          setCurrentStatus(bug.status);
      }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {loading && <CircularProgress sx={{ margin: 'auto' }} />}
        {error && !loading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {bug && !loading && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Detalhes do Defeito: {bug.title}
              </Typography>
              {!isEditingStatus && canEditStatus && (
                <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={handleEnterEditMode}
                    size="small"
                    sx={{ mr: 'auto', ml: 2 }}
                >
                    Editar Status
                </Button>
              )}
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflowY: 'auto', p: 1 }}>
              <DetailItem label="Título" value={bug.title} />
              <DetailItem label="Descrição" value={bug.description} />
              
              {/* Renderização condicional do Status */}
              {!isEditingStatus ? (
                <DetailItem label="Status Atual" value={bug.status.replace(/_/g, ' ')} /> 
              ) : (
                <FormControl fullWidth sx={{ mt: 1, mb: 1.5 }} disabled={!canEditStatus || saving}>
                  <InputLabel id="status-select-label-inline">Status</InputLabel>
                  <Select
                    labelId="status-select-label-inline"
                    value={currentStatus}
                    label="Status"
                    onChange={handleStatusChange}
                    size="small"
                  >
                    {Object.values(BugStatus).map(s => (
                      <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <DetailItem label="Prioridade" value={bug.priority} />
              <DetailItem label="Caso de Teste Vinculado" value={bug.testCase?.title || 'N/A'} />
              <DetailItem label="Desenvolvedor Atribuído" value={bug.assignedDeveloper?.name || 'Ninguém'} />
              <DetailItem label="Criado em" value={formatDateForDisplay(bug.createdAt)} />
              <DetailItem label="Última Atualização" value={formatDateForDisplay(bug.updatedAt)} />
            </Box>

            <Divider sx={{ mt: 'auto', mb: 2 }} /> 
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              {/* Botões do modo Edição */}
              {isEditingStatus && (
                <>
                  <Button variant="outlined" onClick={handleCancelEditMode} disabled={saving}>Cancelar</Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSaveChanges} 
                    disabled={saving || !currentStatus || currentStatus === bug.status}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Salvar Status'}
                  </Button>
                </>
              )}
              {!isEditingStatus && (
                <Button variant="outlined" onClick={handleClose}>Fechar</Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}