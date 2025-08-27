import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../../services/OrganizationService';
import { type Organization } from '../../types/Organization';

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
            <label htmlFor="">{org.name}</label>
            <p>{org.description}</p>
          </div>
          <div>
            <Button
              className="primary-button"
              variant="contained"
              onClick={() => navigate(`/projects`)}
            >
              Entrar
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}