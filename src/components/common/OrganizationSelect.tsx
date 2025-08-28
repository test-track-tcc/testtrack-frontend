import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../../services/OrganizationService';
import { type Organization } from '../../types/Organization';
import { IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function OrganizationSelect() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section className='organization-container'>
      {organizations.map((org) => (
        <div className="project-organization-select" key={org.id}>
          <div className="project-organization-infos">
            <div className='organization-name-header'>
              <label htmlFor="">{org.name}</label>
              <IconButton aria-label="delete" color="primary">
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
    </section>
  );
}