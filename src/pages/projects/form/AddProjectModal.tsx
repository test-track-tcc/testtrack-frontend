import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { type ProjectStatusType, ProjectStatus } from '../../../types/Project';

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

interface AddProjectModalProps {
  open: boolean;
  handleClose: () => void;
  handleSave: (projectData: any) => void;
}

export default function AddProjectModal({ open, handleClose, handleSave }: AddProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [estimateEnd, setEstimateEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<ProjectStatusType>(ProjectStatus.NOT_STARTED);

  const onSave = () => {
    handleSave({
      name,
      description,
      startDate,
      estimateEnd,
      status,
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adicionar Novo Projeto
        </Typography>
        <TextField
          label="Nome do Projeto"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Data de Início"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Previsão de Finalização"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setEstimateEnd(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as ProjectStatusType)}
          >
            <MenuItem value={ProjectStatus.NOT_STARTED}>Não Iniciado</MenuItem>
            <MenuItem value={ProjectStatus.IN_PROGRESS}>Em progresso</MenuItem>
            <MenuItem value={ProjectStatus.FINISHED}>Concluído</MenuItem>
            <MenuItem value={ProjectStatus.BLOCKED}>Bloqueado</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={onSave}>Salvar</Button>
        </Box>
      </Box>
    </Modal>
  );
}