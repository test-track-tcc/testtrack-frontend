import React from 'react';
import { Box, Drawer, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Sidebar />
      </Drawer>

      <Box
        component="main"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
