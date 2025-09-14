import { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../../services/OrganizationService';
import { type Organization } from '../../types/Organization';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOrganizationModal from '../../pages/organization/form/EditOrganizationModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AddUserOrganization from './AddUserOrganization';

export default function OrganizationSelect() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOrg, setDeletingOrg] = useState<Organization | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, orgId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrgId(orgId);
  };

  // CORREÇÃO 1: Esta função agora só fecha o menu.
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditModal = () => {
    const orgToEdit = organizations.find(o => o.id === selectedOrgId);
    if (orgToEdit) {
      setEditingOrg(orgToEdit);
      setIsEditModalOpen(true);
    }
    handleMenuClose(); // Fecha o menu, mas não limpa o ID
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingOrg(null);
    setSelectedOrgId(null); // Limpa o ID aqui, ao fechar o modal
  };

  const handleOrganizationUpdate = (updatedOrg: Organization) => {
    setOrganizations(prevOrgs => 
      prevOrgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
    );
  };

  const handleOpenDeleteModal = () => {
    const orgToDelete = organizations.find(o => o.id === selectedOrgId);
    if (orgToDelete) {
      setDeletingOrg(orgToDelete);
      setIsDeleteModalOpen(true);
    }
    handleMenuClose();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingOrg(null);
    setSelectedOrgId(null); // Limpa o ID aqui
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrg) return;
    try {
      await OrganizationService.delete(deletingOrg.id);
      setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== deletingOrg.id));
      handleCloseDeleteModal();
    } catch (err) {
      setError('Falha ao deletar a organização.');
      handleCloseDeleteModal();
    }
  };

  // CORREÇÃO 2: Esta função agora só abre o modal de membros e fecha o menu.
  const handleOpenMembersModal = () => {
    setIsMembersModalOpen(true);
    handleMenuClose();
  };
  
  const handleCloseMembersModal = () => {
      setIsMembersModalOpen(false);
      setSelectedOrgId(null); // Limpa o ID aqui
  }

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await OrganizationService.get();
        setOrganizations(data);
      } catch (err) {
        setError('Falha ao carregar as organizações.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <section className='organization-container'>
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <div className="project-organization-select" key={org.id}>
              <div className="project-organization-infos">
                <div className='organization-name-header'>
                  <label>{org.name}</label>
                  <IconButton
                    aria-label="more"
                    id={`long-button-${org.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, org.id)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </div>
                <p>{org.description}</p>
              </div>
              <div>
                <Button
                  className="primary-button"
                  variant="contained"
                  onClick={() => navigate(`/organization/${org.id}/projects`)}
                >
                  Entrar
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '50vh'}}>
            <Typography variant="h5" color="text.secondary">
              Você ainda não faz parte de nenhuma organização!
            </Typography>
          </Box>
        )}

        {organizations.length > 0 && (
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                  handleMenuClose();
                  setSelectedOrgId(null);
              }}
            >
              <MenuItem onClick={handleOpenEditModal}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Editar organização</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenMembersModal}>
                <ListItemIcon><GroupIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Gerenciar membros</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenDeleteModal} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Deletar organização</ListItemText>
              </MenuItem>
            </Menu>
        )}
      </section>

      <EditOrganizationModal 
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        organization={editingOrg}
        onUpdate={handleOrganizationUpdate}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Deleção"
        message={`Tem certeza que deseja deletar a organização "${deletingOrg?.name}"? Esta ação não pode ser desfeita.`}
      />
      
      <AddUserOrganization
        open={isMembersModalOpen}
        handleClose={handleCloseMembersModal}
        organizationId={selectedOrgId}
      />
    </>
  );
}