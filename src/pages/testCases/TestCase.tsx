import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, type GridRenderCellParams, type GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, Typography, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase as TestCaseType } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import AddTestCaseModal from './form/AddTestCaseModal';

export default function TestCase() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [projectData, testCasesData] = await Promise.all([
        ProjectService.getById(projectId),
        TestCaseService.getByProjectId(projectId)
      ]);
      setProject(projectData);
      setTestCases(testCasesData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);
  
  const handleDelete = async (id: string) => { /* ... */ };
  const handleEdit = (id: string) => { /* ... */ };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Caso de Teste', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'priority', headerName: 'Prioridade', flex: 1 },
    { field: 'testType', headerName: 'Tipo de Teste', flex: 1 },
    { field: 'idResponsible', headerName: 'Responsável', flex: 1 },
    { field: 'timeEstimated', headerName: 'Tempo Est.', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: (params: GridRenderCellParams<TestCaseType>) => (
        <Box>
          <IconButton color='info' onClick={() => handleEdit(params.row.id!)}><EditIcon /></IconButton>
          <IconButton color='error' onClick={() => handleDelete(params.row.id!)}><DeleteIcon /></IconButton>
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
          onClick={() => setIsModalOpen(true)}
          startIcon={<AddIcon />}
        >
          Adicionar Caso de Teste
        </Button>
      </Box>

      {project && (
        <AddTestCaseModal
            open={isModalOpen}
            projectId={project.id}
            organizationId={project.organization.id}
            handleClose={() => setIsModalOpen(false)}
            onSaveSuccess={fetchData} 
        />
      )}

      {testCases.length > 0 ? (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid rows={testCases} columns={columns} getRowId={(row) => row.id!} />
        </div>
      ) : (
        <Typography align="center" sx={{ mt: 5 }}>
          Nenhum caso de teste cadastrado para este projeto.
        </Typography>
      )}
    </PageLayout>
  );
}