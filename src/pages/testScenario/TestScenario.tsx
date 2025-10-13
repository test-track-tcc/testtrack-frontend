import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageLayout from '../../components/layout/PageLayout';
import { type TestScenario } from '../../types/TestScenario';
import { TestScenarioService } from '../../services/TestScenarioService';
import TestScenarioModal from './TestScenarioModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TestScenarios() {
  const { projectId } = useParams<{ projectId: string }>();
  const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: 'create' | 'edit' | 'view';
    scenario?: TestScenario | null;
  }>({ open: false, mode: 'create', scenario: null });
  
  const [deleteModalState, setDeleteModalState] = useState<{ open: boolean, scenarioId?: string }>({ open: false });

  const fetchTestScenarios = async () => {
    if (!projectId) {
      setError("ID do projeto não encontrado na URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await TestScenarioService.getByProjectId(projectId);
      setTestScenarios(data);
    } catch (err) {
      setError('Não foi possível carregar os cenários de teste.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestScenarios();
  }, [projectId]);

  const handleOpenModal = (mode: 'create' | 'edit' | 'view', scenario: TestScenario | null = null) => {
    setModalState({ open: true, mode, scenario });
  };
  
  const handleCloseModal = () => {
    setModalState({ open: false, mode: 'create', scenario: null });
  };
  
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchTestScenarios();
  };
  
  const handleDelete = async () => {
    if (!deleteModalState.scenarioId) return;
    try {
      await TestScenarioService.delete(deleteModalState.scenarioId);
      setDeleteModalState({ open: false });
      fetchTestScenarios();
    } catch (error) {
      setError('Falha ao deletar o cenário.');
    }
  };

  const columns: GridColDef<TestScenario>[] = [
    { field: 'identifier', headerName: 'Identificador', flex: 1 },
    { field: 'name', headerName: 'Nome', flex: 2 },
    { field: 'objective', headerName: 'Objetivo', flex: 3 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="info" size="small" onClick={() => handleOpenModal('edit', params.row)}><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteModalState({ open: true, scenarioId: params.row.id })}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <PageLayout><Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress /></Box></PageLayout>;
  }

  return (
    <PageLayout>
      <title>Cenários de Teste | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Cenários de Teste</h1>
        <Button className='btn primary icon' onClick={() => handleOpenModal('create')} startIcon={<AddIcon />}>
          Novo Cenário
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box className="box-datagrid" sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={testScenarios}
          columns={columns}
          onRowDoubleClick={(params: GridRowParams) => handleOpenModal('view', params.row as TestScenario)}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      {projectId && (
        <TestScenarioModal 
            open={modalState.open}
            mode={modalState.mode}
            projectId={projectId}
            testScenario={modalState.scenario}
            onClose={handleCloseModal}
            onSaveSuccess={handleSaveSuccess}
        />
      )}
      
      <DeleteConfirmationModal
        open={deleteModalState.open}
        onClose={() => setDeleteModalState({ open: false })}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este cenário de teste?"
      />
    </PageLayout>
  );
}