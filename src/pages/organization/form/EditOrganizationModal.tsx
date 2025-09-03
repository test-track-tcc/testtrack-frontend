import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  ButtonGroup,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';
import { type Organization } from '../../../types/Organization';
import { OrganizationService } from '../../../services/OrganizationService';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

interface EditOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  organization: Organization | null;
  onUpdate: (updatedOrg: Organization) => void;
}

export default function EditOrganizationModal({ open, onClose, organization, onUpdate }: EditOrganizationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setDescription(organization.description || '');
    }
  }, [organization]);

  const handleSave = async () => {
    if (!organization) return;

    try {

      const payload = {
        name,
        description,
      };

      const updatedOrganization = await OrganizationService.update(organization.id, payload);
      onUpdate(updatedOrganization);
      onClose(); 
    } catch (error) {
      console.error('Falha ao salvar a organização', error);
    }
  };

  if (!organization) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, padding: 2 } }}>
      <DialogTitle id='modal-modal-title' sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Editar Organização
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nome da Organização"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Descrição"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
            <Button variant="outlined" startIcon={<GroupOutlinedIcon />}>
                Gerenciar membros
            </Button>
            <Button variant="outlined" startIcon={<ManageAccountsOutlinedIcon />}>
                Gerenciar cargos
            </Button>
            <Button variant="outlined" startIcon={<AccountTreeOutlinedIcon />}>
                Gerenciar projetos
            </Button>
        </Box>
      </DialogContent>
      <ButtonGroup variant="contained" className='group-btn buttons-section'>
        <Button onClick={onClose} variant="outlined">Fechar</Button>
        <Button onClick={handleSave} variant="contained" className='primary-button'>Salvar</Button>
      </ButtonGroup>
    </Dialog>
  );
}