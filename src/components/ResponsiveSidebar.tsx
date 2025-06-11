import React from 'react';
import { Drawer, Box, useMediaQuery, Toolbar, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Person, Home, Settings, AccountBox, Receipt,  } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const menuItems = [
    { text: 'Início', icon: <Home />, route: '/' },
    { text: 'Usuários', icon: <Person />, route: '/users' },
    { text: 'Notas Fiscal', icon: <Receipt />, route: '/invoices' },
    { text: 'Configurações', icon: <Settings />, route: '/configuracoes' },
    { text: 'Perfil', icon: <AccountBox />, route: '/perfil' },
];

interface ResponsiveSidebarProps {
    children: React.ReactNode;
}

const drawerWidth = 240;

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const navigate = useNavigate();

    return (  
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
            >
                <Toolbar />    
                <Box className='sidebar-content' sx={{ overflow: 'auto', p: 2 }}>
                    <h2>TestTrack</h2>
                    <List className='sidebar-list'>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                        <ListItemButton component={Link} to={item.route}>  {/* onClick={() => navigate(item.route)} */}  
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                {/* <FormGroup>
                    <FormControlLabel className='switch-container' labelPlacement='start' control={
                    <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}  />} label="Modo escuro" />
                </FormGroup> */}
                </Box>
                
            </Drawer>

            {/* Conteúdo principal */}
            <Box
                component="main"
                sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default ResponsiveSidebar;
