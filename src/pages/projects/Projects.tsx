import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { type Project } from '../../types/Project';
import { ProjectService } from '../../services/ProjectService';

export default function Projects() {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgId) {
      const fetchProjects = async () => {
        try {
          setLoading(true);
          const data = await ProjectService.getProjectsByOrganization(orgId);
          setProjects(data);
        } catch (error) {
          console.error("Erro ao carregar projetos:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }
  }, [orgId]);

  if (loading) {
    return <PageLayout><div className="project-item"><Typography>Carregando projetos...</Typography></div></PageLayout>;
  }

  return (
    <PageLayout>
      <title>Projetos | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Projetos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/addProject')}
          startIcon={<AddIcon />}
          className="btn primary icon"
        >
          Adicionar Projeto
        </Button>
      </Box>

      <Box className="projects-list" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {projects.length > 0 ? (
          projects.map(project => (
            <Box className="project-item" key={project.id}>
              <h2>{project.name}</h2>
              <p>{project.description || 'Sem descrição.'}</p>
              <p><strong>12</strong>/24 Casos de Testes concluídos</p>
              <p>Data de Conclusão: 20/05/2025</p>
              <p><strong>Status: Em progresso</strong></p>
              <Box className="button-group">
                  <Button className="btn icon secondary" onClick={() => navigate(`/projects/${project.id}/testCase`)}>Editar projeto</Button>
                  <Button className="btn icon primary" onClick={() => navigate(`/projects/${project.id}/testCase`)}>Ver detalhes</Button>
              </Box>
            </Box>
          ))
        ) : (
              <Box className="projects-list" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <div className="project-item">
                  <Typography>Nenhum projeto encontrado para esta organização.</Typography>
                </div>
              </Box>
        )}
      </Box>
    </PageLayout>
  );
}