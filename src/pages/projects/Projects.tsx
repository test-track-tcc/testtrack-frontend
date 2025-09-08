import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { type Project, type CreateProjectPayload } from '../../types/Project';
import { ProjectService } from '../../services/ProjectService';
import AddProjectModal from './form/AddProjectModal';

export default function Projects() {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchProjects = async () => {
        if (!orgId) {
            setError("ID da organização não encontrado na URL.");
            setLoading(false);
            return;
        };
        try {
            setLoading(true);
            const data = await ProjectService.getProjectsByOrganization(orgId);
            setProjects(data);
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
            setError("Não foi possível carregar os projetos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [orgId]);

    const handleSaveProject = async (formData: Omit<CreateProjectPayload, 'organizationId' | 'ownerId'>) => {
        if (!orgId) {
            setError("Não é possível salvar, pois o ID da organização é desconhecido.");
            return;
        }

        const userDataString = localStorage.getItem('userData');
        const ownerId = userDataString ? JSON.parse(userDataString).id : null;

        if (!ownerId) {
            setError("Não foi possível identificar o usuário. Faça login novamente.");
            return;
        }
        
        const projectPayload: CreateProjectPayload = {
            ...formData,
            organizationId: orgId,
            ownerId: ownerId,
        };

        try {
            console.log("Salvando novo projeto:", projectPayload);
            await ProjectService.create(projectPayload);
            handleClose();
            fetchProjects(); // Recarrega a lista para mostrar o novo projeto
        } catch (error) {
            console.error("Erro ao salvar projeto:", error);
            setError("Ocorreu uma falha ao salvar o projeto.");
        }
    };

    if (loading) {
        return <PageLayout><Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /><Typography sx={{mt: 1}}>Carregando projetos...</Typography></Box></PageLayout>;
    }

    return (
        <PageLayout>
            <title>Projetos | TestTrack</title>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <h1>Projetos</h1>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen} // Ação do botão agora abre o modal
                    startIcon={<AddIcon />}
                    className="btn primary icon"
                >
                    Adicionar Projeto
                </Button>
            </Box>

            <AddProjectModal 
                open={open}
                handleClose={handleClose}
                handleSave={handleSaveProject}
            />
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box className="projects-list" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {projects.length > 0 ? (
                    projects.map(project => (
                        <Box className="project-item" key={project.id}>
                            <h2>{project.name}</h2>
                            <p>{project.description || 'Sem descrição.'}</p>
                            <p><strong>Início:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Previsão:</strong> {project.estimateEnd ? new Date(project.estimateEnd).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Status: {project.status}</strong></p>
                            <Box className="button-group" sx={{ marginTop: 'auto', paddingTop: '16px' }}>
                                <Button className="btn icon secondary" onClick={() => navigate(`/projects/${project.id}/edit`)}>Editar projeto</Button>
                                <Button className="btn icon primary" onClick={() => navigate(`/projects/${project.id}/test-cases`)}>Ver detalhes</Button>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
                        <Typography>Nenhum projeto encontrado para esta organização.</Typography>
                        <Button variant="contained" onClick={handleOpen} sx={{mt: 2}}>Criar meu primeiro projeto</Button>
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
}