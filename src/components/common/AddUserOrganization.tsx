import { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, Button, TextField, Select,
    MenuItem, IconButton, CircularProgress, Alert,
    FormControl, InputLabel, Avatar
} from '@mui/material';
// 1. Importe o SelectChangeEvent separadamente
import { type SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { type User } from '../../types/User';
import { OrganizationService } from '../../services/OrganizationService';
import { UsersService } from '../../services/UsersService';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(500px, 60vw, 700px)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

interface AddUserOrganizationProps {
  open: boolean;
  organizationId: string | null;
  handleClose: () => void;
}

export default function AddUserOrganization({ open, organizationId, handleClose }: AddUserOrganizationProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetLocalState = () => {
    setNewMemberEmail('');
    setNewMemberRole('');
    setError('');
    setSuccess('');
  };

  const fetchMembers = async () => {
    if (!organizationId) return;
    setLoading(true);
    setError('');
    try {
      const userList = await OrganizationService.getUsers(organizationId);
      setMembers(userList);
    } catch (err) {
      setError('Não foi possível carregar os membros da organização.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
    } else {
      resetLocalState();
    }
  }, [open, organizationId]);

  const handleInvite = async () => {
    if (!newMemberEmail || !newMemberRole) {
      setError('Por favor, preencha o e-mail e o cargo para convidar.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userToInvite = await UsersService.getUserByEmail(newMemberEmail);
      if (!userToInvite) {
        throw new Error('Usuário não encontrado com este e-mail.');
      }

      if (members.some(member => member.id === userToInvite.id)) {
        throw new Error('Este usuário já é membro da organização.');
      }
      
      if (!organizationId) {
        throw new Error('ID da organização inválido.');
      }

      await OrganizationService.addUserToOrganization({
        userId: userToInvite.id as string,
        organizationId: organizationId,
      });

      setSuccess(`Usuário ${userToInvite.name} convidado com sucesso!`);
      setNewMemberEmail('');
      setNewMemberRole('');
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao convidar o membro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }} component="h2" sx={{ mb: 2 }}>
          Gerenciar membros da organização
        </Typography>

        {loading && <CircularProgress sx={{alignSelf: 'center'}} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {!loading && members.map(member => (
          <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>{member.name?.charAt(0)}</Avatar>
              <Box>
                <Typography fontWeight="bold">{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">{member.email}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FormControl sx={{minWidth: 150}}>
                    <Select defaultValue={'Desenvolvedor'} size="small">
                        <MenuItem value="Administrador Principal">Administrador Principal</MenuItem>
                        <MenuItem value="Desenvolvedor">Desenvolvedor</MenuItem>
                    </Select>
                </FormControl>
                <IconButton color="error"><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}

        <Typography variant="h6" style={{ fontWeight: 'bold' }} sx={{ mb: 2 }}>Convidar membro</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="E-mail"
            variant="outlined"
            size="small"
            fullWidth
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Cargo</InputLabel>
            <Select
              value={newMemberRole}
              label="Cargo"
              onChange={(e: SelectChangeEvent) => setNewMemberRole(e.target.value)}
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="MEMBER">Membro</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleInvite} disabled={loading}>
            Convidar
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={handleClose}>Fechar</Button>
            <Button variant="contained">Salvar</Button>
        </Box>
      </Box>
    </Modal>
  );
}