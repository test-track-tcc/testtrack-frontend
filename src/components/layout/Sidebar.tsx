import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar, Button, Select, MenuItem, Collapse, CircularProgress, type SelectChangeEvent } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CasesIcon from '@mui/icons-material/Cases';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Avatar from '@mui/material/Avatar';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../functions/AuthFunctions';
import { type Organization } from '../../types/Organization';
import { OrganizationService } from '../../services/OrganizationService';
import { ProjectService } from '../../services/ProjectService';
import { type Project } from '../../types/Project';
import { getInitials } from '../../utils/getInitials';

const mainItems = [
    { title: 'Área de Trabalho', path: '/dashboard', icon: <BarChartIcon /> },
    { title: 'Projetos', path: '/projects', icon: <DescriptionIcon /> },
];

const projectSpecificItems = [
    { title: 'Casos de Testes', path: '/testCase', icon: <CasesIcon /> },
    { title: 'Kanban', path: '/kanban', icon: <ViewKanbanIcon /> },
    { title: 'Relatórios', path: '/reports', icon: <AssessmentIcon /> },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orgId, projectId } = useParams<{ orgId: string, projectId: string }>();
    const { handleLogout } = useAuth();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string>('');
    const [orgLoading, setOrgLoading] = useState(true);
    const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectMenuOpen, setProjectMenuOpen] = useState(true);

    useEffect(() => {
        const fetchOrganizations = async (userId?: string) => {
            setOrgLoading(true);
            try {
                const data = await OrganizationService.getUsersOrganization(userId ?? '');
                setOrganizations(data);
                if (orgId && data.some(org => org.id === orgId)) {
                    setSelectedOrg(orgId);
                } else if (data.length > 0) {
                    setSelectedOrg(data[0].id);
                    navigate(`/organization/${data[0].id}/dashboard`);
                }
            } catch (error) {
                console.error("Falha ao buscar organizações", error);
            } finally {
                setOrgLoading(false);
            }
        };

        const userData = localStorage.getItem('userData');
        let userId: string | undefined = undefined;
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser({ id: parsedUser.id, name: parsedUser.name || 'John Doe', role: parsedUser.role || 'Membro' });
            userId = parsedUser.id;
        }

        fetchOrganizations(userId);
    }, []); 

    useEffect(() => {
        const fetchProjects = async () => {
            if (selectedOrg) {
                setProjectsLoading(true);
                setProjects([]);
                try {
                    const projectData = await ProjectService.getProjectsByOrganization(selectedOrg);
                    setProjects(projectData);
                    if (projectId && projectData.some(p => p.id === projectId)) {
                        setSelectedProject(projectId);
                    } else if (projectData.length > 0) {
                        setSelectedProject(projectData[0].id);
                    } else {
                        setSelectedProject('');
                    }
                } catch (error) {
                    console.error("Falha ao buscar projetos", error);
                } finally {
                    setProjectsLoading(false);
                }
            }
        };

        fetchProjects();
    }, [selectedOrg, projectId]);

    const handleOrgChange = (event: SelectChangeEvent<string>) => {
        const newOrgId = event.target.value;
        setSelectedOrg(newOrgId);
        setSelectedProject(''); 
        navigate(`/organization/${newOrgId}/dashboard`);
    };

    const handleProjectChange = (event: SelectChangeEvent<string>) => {
        const newProjId = event.target.value;
        setSelectedProject(newProjId);
        if (selectedOrg) {
            navigate(`/organization/${selectedOrg}/project/${newProjId}/dashboard`);
        }
    };

    const handleItemClick = (path: string) => {
      if (selectedOrg) {
          if (path === '/projects') {
              navigate(`/organization/${selectedOrg}/projects`);
          } else if (path === '/dashboard') {
              navigate(`/organization/${selectedOrg}/dashboard`);
          } else {
              navigate(path);
          }
      } else {
          navigate(path);
      }
    };
    
    const handleProjectSpecificItemClick = (path: string) => {
        if (selectedOrg && selectedProject) {
            navigate(`/organization/${selectedOrg}/project/${selectedProject}${path}`);
        } else {
            console.warn('Organização ou Projeto não selecionado.');
        }
    };

    const handleProjectMenuClick = () => {
        setProjectMenuOpen(!projectMenuOpen);
    };

    const isMainItemActive = (path: string): boolean => {
        const basePath = `/organization/${selectedOrg}`;
        
        if (path === '/dashboard') {
            return location.pathname === `${basePath}/dashboard`;
        }
        
        if (path === '/projects') {
            return location.pathname.startsWith(`${basePath}/projects`);
        }

        return location.pathname.startsWith(path);
    };
    
    const isProjectItemActive = (path: string): boolean => {
        if (!selectedOrg || !selectedProject) {
            return false;
        }
        const projectBasePath = `/organization/${selectedOrg}/project/${selectedProject}`;
        return location.pathname.startsWith(`${projectBasePath}${path}`);
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Box className="sidebar-logo">
                    <h1 className="title-header-link"><a href={user ? "/organization" : "/login"}>TestTrack</a></h1>
                    <p>Automatize, gerencie, evolua seus projetos</p>
                </Box>
            </Toolbar>

            <Box>
                <Box className="organization-div">
                    <a className='sidebar-label' href='/organization'>Organização</a>
                    <Select
                        value={orgLoading ? '' : selectedOrg}
                        onChange={handleOrgChange}
                        className='organization-select'
                        disabled={orgLoading}
                        renderValue={(value) => orgLoading ? <CircularProgress size={20} /> : organizations.find(o => o.id === value)?.name}
                    >
                        {organizations.map((org) => (
                            <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            
            <Box>
                <Box className="organization-div">
                    <label className='sidebar-label'>Projeto Selecionado</label> 
                    <Select
                        value={projectsLoading ? '' : selectedProject}
                        onChange={handleProjectChange}
                        className='organization-select'
                        disabled={projectsLoading || projects.length === 0}
                        renderValue={(value) => {
                            if (projectsLoading) return <CircularProgress size={20} />;
                            if (!value) return <em>Nenhum projeto</em>;
                            return projects.find(p => p.id === value)?.name;
                        }}
                    >
                        {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            <List>
                <label className='sidebar-label'>Geral</label>
                {mainItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={isMainItemActive(item.path)}
                        onClick={() => handleItemClick(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                ))}
            </List>

            {selectedProject && (
                <>
                    <List disablePadding>
                        <ListItemButton onClick={handleProjectMenuClick}>
                             <ListItemIcon><DescriptionIcon /></ListItemIcon>
                            <ListItemText primary={`Menu do Projeto`} />
                            {projectMenuOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </List>
                    
                    <Collapse in={projectMenuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {projectSpecificItems.map((item) => (
                                <ListItemButton
                                    key={item.path}
                                    sx={{ pl: 4 }}
                                    selected={isProjectItemActive(item.path)}
                                    onClick={() => handleProjectSpecificItemClick(item.path)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </>
            )}

            <Box flexGrow={1} />
            <Box display={'flex'} flexDirection={'row'} p={2} className="user-info" gap={"10px"}>
                <Avatar>{user ? getInitials(user.name) : 'TT'}</Avatar>
                <Box flexDirection={'column'} className="user-details">
                    <p className='user-name'>{user?.name || 'Usuário'}</p>
                    <p className='user-role'>
                        {user?.role || 'Visitante'} em {organizations.find(org => org.id === selectedOrg)?.name || ''}
                    </p>
                </Box>
            </Box>
            
            <Box className="logout-button" textAlign="center" p={2}>
                <Button variant="outlined" color="secondary" startIcon={<LogoutIcon />} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Box>
    );
}