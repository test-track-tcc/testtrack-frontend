import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Box, Tabs, Tab } from '@mui/material';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { type Organization } from '../../types/Organization';
import AccessGroupManager from './AccessGroupManager'; // O componente que acabamos de criar
import PermissionManager from './PermissionManager';   // O componente que você me enviou

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ManageAccessGroupsModal({ open, onClose, organization }: { open: boolean; onClose: () => void; organization: Organization }) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className='manage-modal'>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                Gerenciar Acessos: {organization.name}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab icon={<GroupWorkIcon />} iconPosition="start" label="Grupos de Acesso" />
                        <Tab icon={<VpnKeyIcon />} iconPosition="start" label="Permissões" />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <AccessGroupManager organization={organization} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <PermissionManager organization={organization} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
}