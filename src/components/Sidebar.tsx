import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Toolbar, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


const drawerItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <i className="fas fa-chart-bar" /> },
    { title: 'Relatórios', path: '/relatorios', icon: <i className="fas fa-file-alt" /> },
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
            <Box display="flex" alignItems="center">
            <h1>TestTrack</h1>
            </Box>
        </Toolbar>
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
