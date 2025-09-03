import { useEffect, useState } from 'react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../../services/OrganizationService';
import { type Organization } from '../../types/Organization';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOrganizationModal from '../../pages/organization/form/EditOrganizationModal';

export default function OrganizationSelect() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, orgId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrgId(orgId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrgId(null);
  };

  const handleOpenEditModal = () => {
    const orgToEdit = organizations.find(o => o.id === selectedOrgId);
    if (orgToEdit) {
      setEditingOrg(orgToEdit);
      setIsModalOpen(true);
    }
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  const handleOrganizationUpdate = (updatedOrg: Organization) => {
    setOrganizations(prevOrgs => 
      prevOrgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
    );
  };

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
    return <div>Carregando organizações...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <section className='organization-container'>
        {organizations.map((org) => (
          <div className="project-organization-select" key={org.id}>
            <div className="project-organization-infos">
              <div className='organization-name-header'>
                <label>{org.name}</label>
                <IconButton
                  aria-label="more"
                  id={`long-button-${org.id}`}
                  aria-controls={anchorEl && selectedOrgId === org.id ? 'long-menu' : undefined}
                  aria-expanded={anchorEl && selectedOrgId === org.id ? 'true' : undefined}
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
        ))}

        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': `long-button-${selectedOrgId}`,
          }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenEditModal}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar organização</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Gerenciar membros</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Deletar organização</ListItemText>
          </MenuItem>
        </Menu>
      </section>

      <EditOrganizationModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        organization={editingOrg}
        onUpdate={handleOrganizationUpdate}
      />
    </>
  );
}