import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, ButtonGroup } from '@mui/material';
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
  const [startDate, setStartDate] = useState('');
  const [estimateEnd, setEstimateEnd] = useState('');
  const [status, setStatus] = useState<ProjectStatusType>(ProjectStatus.NOT_STARTED);

  const onSave = () => {
    handleSave({
      name,
      description,
      startDate: startDate || null,
      estimateEnd: estimateEnd || null,
      status,
    });
    setName('');
    setDescription('');
    setStartDate('');
    setEstimateEnd('');
    setStatus(ProjectStatus.NOT_STARTED);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className='add-modal'
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
          autoComplete='off'
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Descrição"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          autoComplete='off'
          onChange={(e) => setDescription(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Status do Projeto</InputLabel>
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

        <TextField
          label="Data de Início"
          type="date"
          value={startDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          label="Previsão de Finalização"
          type="date"
          value={estimateEnd}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setEstimateEnd(e.target.value)}
        />

        <ButtonGroup variant="contained" className='group-btn buttons-section'>
          <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={onSave}>Salvar</Button>
        </ButtonGroup>
      </Box>
    </Modal>
  );
}