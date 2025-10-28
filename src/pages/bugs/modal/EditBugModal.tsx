import { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, IconButton, CircularProgress, Alert,
  Divider, Select, MenuItem, FormControl, InputLabel, Button, type SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BugsService } from '../../../services/BugsService';
import { BugStatus } from '../../../types/Bug';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(400px, 50vw, 600px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

interface EditBugStatusModalProps {
  open: boolean;
  bugId: string | null;
  handleClose: () => void;
  onStatusUpdated: () => void;
}

export default function EditBugStatusModal({ open, bugId, handleClose, onStatusUpdated }: EditBugStatusModalProps) {
  const [bugTitle, setBugTitle] = useState('');
  const [initialStatus, setInitialStatus] = useState<BugStatus | ''>('');
  const [currentStatus, setCurrentStatus] = useState<BugStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canEditStatus = true; 

  useEffect(() => {
    const fetchBugStatus = async () => {
      if (!bugId) return;
      setLoading(true); setError('');
      try {
        const data = await BugsService.findOne(bugId);
        setBugTitle(data.title);
        setInitialStatus(data.status);
        setCurrentStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Falha ao carregar status do bug.');
        setBugTitle(''); setInitialStatus(''); setCurrentStatus('');
      } finally { setLoading(false); }
    };

    if (open) { fetchBugStatus(); }
     else { 
        setBugTitle(''); setInitialStatus(''); setCurrentStatus('');
     }
  }, [open, bugId]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setCurrentStatus(event.target.value as BugStatus);
  };

  const handleSaveChanges = async () => {
    if (!bugId || !currentStatus || currentStatus === initialStatus) return;
    setSaving(true); setError('');
    try {
      await BugsService.updateStatus(bugId, currentStatus);
      onStatusUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar o status.');
    } finally { setSaving(false); }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">Editar Status do Defeito</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {loading && <CircularProgress sx={{ mx: 'auto', mb: 2 }} />}
        {error && !loading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && bugTitle && (
            <>
                <Typography sx={{ mb: 1 }}>Defeito: <strong>{bugTitle}</strong></Typography>
                <FormControl fullWidth sx={{ mt: 1 }} disabled={!canEditStatus || saving || loading}>
                    <InputLabel id="status-select-label-edit">Status</InputLabel>
                    <Select
                    labelId="status-select-label-edit"
                    value={currentStatus}
                    label="Status"
                    onChange={handleStatusChange}
                    >
                    {Object.values(BugStatus).map(s => (
                        <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 4 }}>
                    <Button variant="outlined" onClick={handleClose} disabled={saving}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveChanges} 
                        disabled={saving || currentStatus === initialStatus || loading}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Salvar Status'}
                    </Button>
                </Box>
            </>
        )}
      </Box>
    </Modal>
  );
}