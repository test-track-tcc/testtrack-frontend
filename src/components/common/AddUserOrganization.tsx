import { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Button, TextField, Select,
  MenuItem, IconButton, CircularProgress, Alert,
  FormControl, InputLabel, Avatar
} from '@mui/material';
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

// Tipo para o membro, agora incluindo o cargo
type OrganizationMember = User & { role: 'ADMIN' | 'MEMBER' | 'DEVELOPER' };
type OrganizationRole = 'ADMIN' | 'MEMBER' | 'DEVELOPER';

export default function AddUserOrganization({ open, organizationId, handleClose }: AddUserOrganizationProps) {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<OrganizationRole>('MEMBER'); // Estado para o cargo do novo membro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetLocalState = () => {
    setNewMemberEmail('');
    setNewMemberRole('MEMBER');
    setError('');
    setSuccess('');
    setMembers([]);
  };

  const fetchMembers = async () => {
    if (!organizationId) return;
    setLoading(true);
    setError('');
    try {
      // Chama o método atualizado do serviço
      const userList = await OrganizationService.getUsers(organizationId);
      setMembers(userList);
    } catch (err) {
      setError('Não foi possível carregar os membros da organização.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && organizationId) {
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
    if (!organizationId) return;

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

      await OrganizationService.addUserToOrganization({
        userId: userToInvite.id as string,
        organizationId: organizationId,
        role: newMemberRole,
      });

      setSuccess(`Usuário ${userToInvite.name} convidado com sucesso!`);
      setNewMemberEmail('');
      setNewMemberRole('MEMBER');
      fetchMembers(); // Re-busca a lista de membros
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao convidar o membro.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!organizationId || !window.confirm(`Tem certeza que deseja remover ${userName} da organização?`)) {
        return;
    }
    try {
        await OrganizationService.removeUserFromOrganization(organizationId, userId);
        setSuccess('Usuário removido com sucesso!');
        fetchMembers();
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao remover o usuário.');
    }
  };

  // NOVA FUNÇÃO para alterar o cargo
  const handleRoleChange = async (userId: string, event: SelectChangeEvent) => {
    if (!organizationId) return;
    const newRole = event.target.value as OrganizationRole;

    try {
        await OrganizationService.updateUserRole(organizationId, userId, newRole);
        setSuccess('Cargo atualizado com sucesso!');
        // Atualiza o estado local para uma resposta visual imediata
        setMembers(prevMembers =>
            prevMembers.map(member =>
                member.id === userId ? { ...member, role: newRole } : member
            )
        );
    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao atualizar o cargo do usuário.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }} component="h2" sx={{ mb: 2 }}>
          Gerenciar membros da organização
        </Typography>

        {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
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
              <FormControl sx={{ minWidth: 150 }} size="small">
                {/* O valor do Select agora vem do 'member.role' */}
                <Select value={member.role} onChange={(e) => member.id && handleRoleChange(member.id, e)}>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="MEMBER">Membro</MenuItem>
                  <MenuItem value="DEVELOPER">Desenvolvedor</MenuItem>
                </Select>
              </FormControl>
              {/* Adicionado o onClick para o botão de deletar */}
              <IconButton
                color="error"
                onClick={() => member.id && member.name && handleRemoveUser(member.id, member.name)}
                disabled={!member.id || !member.name}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Typography variant="h6" style={{ fontWeight: 'bold' }} sx={{ my: 2 }}>Convidar membro</Typography>
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
              onChange={(e: SelectChangeEvent<OrganizationRole>) => setNewMemberRole(e.target.value as OrganizationRole)}
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="MEMBER">Membro</MenuItem>
              <MenuItem value="DEVELOPER">Desenvolvedor</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleInvite} disabled={loading}>
            Convidar
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={handleClose}>Fechar</Button>
        </Box>
      </Box>
    </Modal>
  );
}