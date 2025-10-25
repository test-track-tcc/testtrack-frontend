// Caminho: src/pages/home/Dashboard.tsx (Modificado)

import { useState } from 'react';
import PageLayout from "../../components/layout/PageLayout";
import { Tabs, Tab, Box, Typography } from '@mui/material';

// Importe os novos componentes de aba
import ReportsTab from './ReportsTab'; // Nosso componente de relatórios
import RealTimeTab from './RealtimeTab'; 

// Componente helper para o painel da aba
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}> {/* Adiciona padding superior ao conteúdo da aba */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Função helper para acessibilidade
function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

export default function ReportsPage() {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };
    
    return (
        <PageLayout>
            <title>Relatórios | TestTrack</title>
            <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}} gutterBottom>
              Relatórios
            </Typography>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="Abas do Dashboard">
                        <Tab label="Relatórios" {...a11yProps(0)} />
                        <Tab label="Tempo Real" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                
                {/* Painel da Aba de Relatórios */}
                <TabPanel value={selectedTab} index={0}>
                    <ReportsTab />
                </TabPanel>
                
                {/* Painel da Aba de Tempo Real */}
                <TabPanel value={selectedTab} index={1}>
                    <RealTimeTab />
                </TabPanel>
            </Box>
        </PageLayout>
    )
}