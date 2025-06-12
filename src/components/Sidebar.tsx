// import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Toolbar, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const drawerItems = [
    { title: 'Casos de Testes', path: '/addTestCases', icon: <i className="fas fa-chart-bar" /> },
    { title: 'Área de Trabalho', path: '/home', icon: <i className="fas fa-chart-bar" /> },
    { title: 'Projetos', path: '/projects', icon: <i className="fas fa-file-alt" /> },
    { title: 'Kanban', path: '/kanban', icon: <i className="fas fa-file-alt" /> },
    { title: 'Relátorios', path: '/reports', icon: <i className="fas fa-file-alt" /> },
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
            <Box display="flex" alignItems="center" sx={{ flexDirection: "column" }}>
                <h1>TestTrack</h1>
                <p>Automatize, gerencie, evolua seus projetos</p>
            </Box>
        </Toolbar>
        <Divider />

        <Box>
            <Box>
                <Select 
                    value={organizations[0].id} 
                    onChange={(e) => console.log(e.target.value)} 
                    label="Organização"
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
        <Box textAlign="center" p={2}>
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
