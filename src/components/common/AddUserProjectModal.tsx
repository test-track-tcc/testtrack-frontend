import { useState, useEffect } from 'react';
import { 
    Modal, Box, Typography, Button, CircularProgress, Alert, 
    FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, 
    Avatar, IconButton, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Project } from '../../types/Project';
import { type User } from '../../types/User';
import { OrganizationService } from '../../services/OrganizationService';
import { ProjectService } from '../../services/ProjectService';

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

interface AddUserToProjectModalProps {
  open: boolean;
  project: Project | null;
  handleClose: () => void;
  onSuccess: () => void;
}

export default function AddUserToProjectModal({ open, project, handleClose, onSuccess }: AddUserToProjectModalProps) {
  const [members, setMembers] = useState<User[]>([]); 
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    if (!project) return;
    setLoading(true);
    setError('');
    try {
      const [orgUsers, projectMembers] = await Promise.all([
        OrganizationService.getUsers(project.organization.id),
        ProjectService.getUsers(project.id)
      ]);

      setOrganizationUsers(orgUsers);
      setMembers(projectMembers);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, project]);

  const handleAddUser = async () => {
    if (!project || !selectedUserId) {
      setError('Por favor, selecione um utilizador.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ProjectService.addUserToProject(project.id, {
        userId: selectedUserId,
      });
      setSuccess('Utilizador adicionado com sucesso!');
      setSelectedUserId('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao adicionar o utilizador.');
    } finally {
      setLoading(false);
    }
  };

  // NOVA FUNÇÃO para remover o utilizador
  const handleRemoveUser = async (userId: string) => {
    if (!project) return;

    if (window.confirm('Tem a certeza de que deseja remover este membro do projeto?')) {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await ProjectService.removeUserFromProject(project.id, userId);
        setSuccess('Membro removido com sucesso!');
        fetchData(); // Recarrega a lista de membros
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha ao remover o membro.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const usersToInvite = organizationUsers.filter(orgUser => 
    !members.some(member => member.id === orgUser.id)
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Gerenciar membros do projeto "{project?.name}"
        </Typography>

        {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        {!loading && members.length > 0 && (
            <Typography sx={{mb: 1, fontWeight: 'bold'}}>Membros Atuais</Typography>
        )}
        {!loading && members.map(member => (
          <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>{member.name?.charAt(0)}</Avatar>
              <Box>
                <Typography fontWeight="bold">{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">{member.email}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary"></Typography>
              <IconButton
                color="error"
                onClick={() => member.id && handleRemoveUser(member.id)}
                disabled={!member.id}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Adicionar membro</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl fullWidth size="small">
            <InputLabel>Selecionar Utilizador da Organização</InputLabel>
            <Select value={selectedUserId} label="Selecionar Utilizador da Organização" onChange={(e: SelectChangeEvent) => setSelectedUserId(e.target.value)}>
              {usersToInvite.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddUser} disabled={loading}>
            Adicionar
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={handleClose}>Fechar</Button>
        </Box>
      </Box>
    </Modal>
  );
}