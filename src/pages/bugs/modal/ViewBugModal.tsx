// src/pages/bugs/modal/ViewBugModal.tsx (ou onde estiver seu arquivo)
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, IconButton, CircularProgress, Alert, Divider, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BugsService } from '../../../services/BugsService';
import { type Bug } from '../../../types/Bug'; 
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
}

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <Box mb={1.5}>
    <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 'bold' }}>{label}</Typography>
    <Typography variant="body1" sx={{ pl: 1, whiteSpace: 'pre-wrap' }}>{value || '---'}</Typography>
  </Box>
);

export default function ViewBugModal({ open, bugId, handleClose }: ViewBugModalProps) {
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBug = async () => {
      if (!bugId) return;
      setLoading(true);
      setError('');
      try {
        const data = await BugsService.findOne(bugId);
        setBug(data);
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
    }
  }, [open, bugId]);

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
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflowY: 'auto', p: 1 }}>
              <DetailItem label="Título" value={bug.title} />
              <DetailItem label="Descrição" value={bug.description} />
              <DetailItem label="Status Atual" value={bug.status.replace(/_/g, ' ')} /> 
              <DetailItem label="Prioridade" value={bug.priority} />
              <DetailItem label="Caso de Teste Vinculado" value={bug.testCase?.title || 'N/A'} />
              <DetailItem label="Desenvolvedor Atribuído" value={bug.assignedDeveloper?.name || 'Ninguém'} />
              <DetailItem label="Criado em" value={formatDateForDisplay(bug.createdAt)} />
              <DetailItem label="Última Atualização" value={formatDateForDisplay(bug.updatedAt)} />
            </Box>

            <Divider sx={{ mt: 'auto', mb: 2 }} /> 
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              <Button variant="outlined" onClick={handleClose}>Fechar</Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}