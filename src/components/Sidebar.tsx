// import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Toolbar, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CasesIcon from '@mui/icons-material/Cases';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Avatar from '@mui/material/Avatar';

const drawerItems = [
    { title: 'Área de Trabalho', path: '/home', icon: <BarChartIcon /> },
    { title: 'Projetos', path: '/projects', icon: <DescriptionIcon /> },
    { title: 'Casos de Testes', path: '/testCase', icon: <CasesIcon /> },
    { title: 'Kanban', path: '/kanban', icon: <ViewKanbanIcon /> },
    { title: 'Relátorios', path: '/reports', icon: <AssessmentIcon /> },
    ];

const organizations = [
    { id: 1, name: 'TestTrack Team' },
    { id: 2, name: 'PUCPR' },
    { id: 3, name: `Diogo's Team`  },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeItem = drawerItems.find(item =>
        location.pathname.startsWith(item.path)
    );

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toolbar>
            <Box className="sidebar-logo">
                <h1>TestTrack</h1>
                <p>Automatize, gerencie, evolua seus projetos</p>
            </Box>
        </Toolbar>
        <Divider />

        <Box>
            <Box className="organization-div">
                <p>Organização</p>
                <Select 
                    value={organizations[0].id} 
                    onChange={(e) => console.log(e.target.value)} 
                    className='organization-select'
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
            const isActive = activeItem?.path === item.path;
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
                <Avatar>JD</Avatar>
                <Box flexDirection={'column'} className="user-details">
                    <p className='user-name'>John Doe</p>
                    <p className='user-role'>Gestor de Projeto</p>
                </Box>
            </Box>
            
            <Box className="logout-button" textAlign="center" p={2}>
                <Button
                variant="outlined"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={() => navigate('/')}
                >
                Logout
                </Button>
            </Box>
        </Box>
    );
}
