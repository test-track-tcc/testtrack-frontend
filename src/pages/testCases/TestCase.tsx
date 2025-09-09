import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid, type GridRenderCellParams, type GridColDef  } from '@mui/x-data-grid'; 
import { Box, Button, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase as TestCaseType } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import EditTestCaseModal from './form/EditTestCaseModal';
import CreateTestCaseModal from './form/CreateTestCaseModal';

export default function TestCase() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingTestCaseId(id);
  };

  const handleCloseEditModal = () => {
    setEditingTestCaseId(null);
  };

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError('');
      const [projectData, testCasesData] = await Promise.all([
        ProjectService.getById(projectId),
        TestCaseService.getByProjectId(projectId)
      ]);
      setProject(projectData);
      setTestCases(testCasesData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Não foi possível carregar os dados do projeto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
        try {
            await TestCaseService.delete(id);
            fetchData();
        } catch (err) {
            console.error('Erro ao deletar caso de teste:', err);
            setError('Falha ao excluir o caso de teste.');
        }
    }
  };

  const columns: GridColDef<TestCaseType>[] = [
    { 
      field: 'projectSequenceId', 
      headerName: 'ID',
      width: 100,
      valueGetter: (_value, row) => {
        return `${row.project.prefix}-${row.projectSequenceId}`;
      }
    },
    { field: 'title', headerName: 'Caso de Teste', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'priority', headerName: 'Prioridade', flex: 1 },
    { field: 'testType', headerName: 'Tipo de Teste', flex: 1 },
    {
      field: 'responsible',
      headerName: 'Responsável',
      flex: 1,
      valueGetter: (_value, row) => {
        return row.responsible?.name || 'Nenhum';
      },
    },
    { field: 'timeEstimated', headerName: 'Tempo Est.', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: (params: GridRenderCellParams<TestCaseType>) => (
        <Box>
          <IconButton color="info" onClick={() => handleEdit(params.row.id!)}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id!)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <PageLayout><Box sx={{textAlign: 'center', p: 3}}><CircularProgress /></Box></PageLayout>;
  }

  return (
    <PageLayout>
      <title>Casos de Testes | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Casos de Teste: {project?.name || 'Projeto'}</h1>
        <Button
          className='btn primary icon'
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<AddIcon />}
        >
          Adicionar Caso de Teste
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {project && (
        <CreateTestCaseModal
            open={isCreateModalOpen}
            projectId={project.id}
            projectName={project.name}
            organizationId={project.organization.id}
            handleClose={() => setIsCreateModalOpen(false)}
            onSaveSuccess={fetchData} 
        />
      )}

      {project && (
        <EditTestCaseModal
          open={!!editingTestCaseId}
          testCaseId={editingTestCaseId}
          handleClose={handleCloseEditModal}
          onSaveSuccess={fetchData}
        />
      )}

      <section className='page-body'>
        <Box className='section-datagrid-filter'>
          <label>Projeto</label>

          <label>Pesquisa</label>

          <label>Status</label>

          <label>Script</label>
        </Box>
        {testCases.length > 0 ? (
          <Box className="box-datagrid">
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid<TestCaseType>
                rows={testCases}
                columns={columns}
                getRowId={(row) => row.id!}
              />
            </div>
          </Box>
        ) : (
          <Typography align="center" sx={{ mt: 5 }}>
            Nenhum caso de teste cadastrado para este projeto.
          </Typography>
        )}
      </section>
    </PageLayout>
  );
}
