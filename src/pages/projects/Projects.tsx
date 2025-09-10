import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Box, Button, Typography, CircularProgress, Alert, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { type Project, type CreateProjectPayload } from '../../types/Project';
import { ProjectService } from '../../services/ProjectService';
import AddProjectModal from './form/AddProjectModal';
import EditProjectModal from './form/EditProjectModal';

export default function Projects() {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const isMenuOpen = Boolean(anchorEl);

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
        const projectPayload: CreateProjectPayload = { ...formData, organizationId: orgId, ownerId: ownerId };
        try {
            await ProjectService.create(projectPayload);
            setCreateModalOpen(false);
            fetchProjects();
        } catch (error) {
            console.error("Erro ao salvar projeto:", error);
            setError("Ocorreu uma falha ao salvar o projeto.");
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedProjectId(projectId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProjectId(null);
    };

    const handleDelete = async () => {
        if (!selectedProjectId) return;
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                await ProjectService.delete(selectedProjectId);
                fetchProjects();
            } catch (err) {
                setError('Falha ao excluir o projeto.');
            } finally {
                handleMenuClose();
            }
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
                <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)} startIcon={<AddIcon />}>
                    Adicionar Projeto
                </Button>
            </Box>

            <AddProjectModal 
                open={isCreateModalOpen}
                handleClose={() => setCreateModalOpen(false)}
                handleSave={handleSaveProject}
            />

            <EditProjectModal 
                open={!!editingProject}
                project={editingProject}
                handleClose={() => setEditingProject(null)}
                onSaveSuccess={() => {
                    setEditingProject(null);
                    fetchProjects();
                }}
            />
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box className="projects-list" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {projects.length > 0 ? (
                    projects.map(project => (
                        <Box className="project-item" key={project.id}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <h2>{project.name}</h2>
                                <IconButton onClick={(e) => handleMenuClick(e, project.id)}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>
                            
                            <p>{project.description || 'Sem descrição.'}</p>
                            <p><strong>Início:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Previsão:</strong> {project.estimateEnd ? new Date(project.estimateEnd).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Status: {project.status}</strong></p>

                            <Box className="button-group" sx={{ marginTop: 'auto', paddingTop: '16px' }}>
                                <Button className="btn icon secondary" onClick={() => setEditingProject(project)}>Editar projeto</Button>
                                <Button className="btn icon primary" onClick={() => navigate(`/projects/${project.id}/test-cases`)}>Ver detalhes</Button>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
                        <Typography>Nenhum projeto encontrado para esta organização.</Typography>
                        <Button variant="contained" onClick={() => setCreateModalOpen(true)} sx={{mt: 2}}>Criar meu primeiro projeto</Button>
                    </Box>
                )}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Excluir projeto</MenuItem>
            </Menu>
        </PageLayout>
    );
}