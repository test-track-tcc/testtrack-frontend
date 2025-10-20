import { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Button,
  Modal, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert
} from '@mui/material';
import { BugsService } from '../../services/BugsService';
import { type Bug } from '../../types/Bug';
import { type User } from '../../types/User';
import PageLayout from '../../components/layout/PageLayout';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function BugsPage() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bugsData = await BugsService.getAllBugs();
        setBugs(bugsData);
        const usersData = await BugsService.getAllUsers();
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (bug: Bug) => {
    setSelectedBug(bug);
    setSelectedDeveloperId(bug.assignedDeveloperId || '');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBug(null);
    setSelectedDeveloperId('');
  };

  const handleAssignDeveloper = async () => {
    if (!selectedBug || !selectedDeveloperId) return;

    try {
      const updatedBug = await BugsService.assignDeveloper(selectedBug.id, selectedDeveloperId);
      
      setBugs(bugs.map(b => (b.id === updatedBug.id ? updatedBug : b)));
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Erro ao atribuir desenvolvedor');
    }
  };

  if (isLoading) {
    return <PageLayout><CircularProgress /></PageLayout>;
  }

  return (
    <PageLayout>
        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          Lista de Defeitos (Bugs)
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        
        <List className='bugs-list'>
          {bugs.length === 0 && <Typography>Nenhum bug encontrado.</Typography>}
          {bugs.map((bug) => (
            <ListItem key={bug.id} divider>
              <ListItemText
                primary={bug.title}
                secondary={
                  `Status: ${bug.status} | Prioridade: ${bug.priority} | Responsável: ${bug.assignedDeveloper?.name || 'Nenhum'}`
                }
              />
              <Button 
                variant="contained" 
                onClick={() => handleOpenModal(bug)}
              >
                Atribuir
              </Button>
            </ListItem>
          ))}
        </List>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Atribuir Desenvolvedor
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Bug: {selectedBug?.title}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="developer-select-label">Desenvolvedor</InputLabel>
              <Select
                labelId="developer-select-label"
                value={selectedDeveloperId}
                label="Desenvolvedor"
                onChange={(e) => setSelectedDeveloperId(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="contained" onClick={handleAssignDeveloper}>Salvar</Button>
            </Box>
          </Box>
        </Modal>

    </PageLayout>
  );
}

export default BugsPage;