import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Toolbar, Button, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CasesIcon from '@mui/icons-material/Cases';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../../functions/AuthFunctions';
import { type Organization } from '../../types/Organization';
import { OrganizationService } from '../../services/OrganizationService';
import { getInitials } from '../../utils/getInitials';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const drawerItems = [
    { title: 'Área de Trabalho', path: '/home', icon: <BarChartIcon /> },
    { title: 'Projetos', path: '/projects', icon: <DescriptionIcon /> },
    { title: 'Casos de Testes', path: '/testCase', icon: <CasesIcon /> },
    { title: 'Kanban', path: '/kanban', icon: <ViewKanbanIcon /> },
    { title: 'Relátorios', path: '/reports', icon: <AssessmentIcon /> },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId: string }>();
    const { handleLogout } = useAuth();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const data = await OrganizationService.get();
                setOrganizations(data);
                if (orgId && data.some(org => org.id === orgId)) {
                    setSelectedOrg(orgId);
                } else if (data.length > 0) {
                    setSelectedOrg(data[0].id);
                }
            } catch (error) {
                console.error("Falha ao buscar organizações", error);
            } finally {
                setLoading(false);
            }
        };

        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchOrganizations();
    }, [orgId]); 

    const handleItemClick = (path: string) => {
        if (selectedOrg) {
             if(path === '/projects') {
                navigate(`/organization/${selectedOrg}/projects`);
            } else {
                navigate(path)
            }
        }
    };
    
    const handleOrgChange = (event: SelectChangeEvent<string>) => {
        const newOrgId = event.target.value;
        setSelectedOrg(newOrgId);
        navigate(`/organization/${newOrgId}/projects`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Box className="sidebar-logo">
                    <h1 className="title-header-link"><a href={user ? "/organization" : "/login"}>TestTrack</a></h1>
                    <p>Automatize, gerencie, evolua seus projetos</p>
                </Box>
            </Toolbar>
            <Divider />

            <Box>
                <Box className="organization-div">
                    <a href='/organization'>Organização <ArrowRightAltIcon></ArrowRightAltIcon></a>
                    <Select
                        value={loading ? '' : selectedOrg}
                        onChange={handleOrgChange}
                        className='organization-select'
                        disabled={loading}
                    >
                        {organizations.map((organization) => (
                            <MenuItem
                                key={organization.id}
                                value={organization.id}
                            >
                                {organization.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            <Divider />

            <List>
                {drawerItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                        <ListItemButton
                            key={item.path}
                            selected={isActive}
                            onClick={() => handleItemClick(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    );
                })}
            </List>

            <Box flexGrow={1} />
            <Box display={'flex'} flexDirection={'row'} p={2} className="user-info" gap={"10px"}>
                <Avatar>{user ? getInitials(user.name) : ''}</Avatar>
                <Box flexDirection={'column'} className="user-details">
                    <p className='user-name'>{user?.name}</p>
                    <p className='user-role'>Gestor de Projeto</p>
                </Box>
            </Box>
            
            <Box className="logout-button" textAlign="center" p={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}