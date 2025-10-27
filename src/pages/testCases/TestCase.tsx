import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid, type GridRenderCellParams, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { Box, Button, IconButton, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, TextField, type SelectChangeEvent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase as TestCaseType, TestCaseStatus, Priority } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import EditTestCaseModal from './form/EditTestCaseModal';
import CreateTestCaseModal from './form/CreateTestCaseModal';
import ViewTestCaseModal from './form/ViewTestCaseModal';

export default function TestCase() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const handleEdit = (id: string) => setEditingTestCaseId(id);
  const handleCloseEditModal = () => setEditingTestCaseId(null);
  const [viewingTestCaseId, setViewingTestCaseId] = useState<string | null>(null);

  const handleView = (id: string) => setViewingTestCaseId(id);
  const handleCloseViewModal = () => setViewingTestCaseId(null);

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError('');

      const projectData = await ProjectService.getById(projectId);
      setProject(projectData);

      if (projectData?.organization?.id) {
        const organizationId = projectData.organization.id;

        const [testCasesData, allProjectsData] = await Promise.all([
          TestCaseService.getByProjectId(projectId),
          ProjectService.getProjectsByOrganization(organizationId)
        ]);

        setTestCases(testCasesData);
        setAllProjects(allProjectsData);
      } else {
        throw new Error('Não foi possível encontrar a organização para este projeto.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Não foi possível carregar os dados do projeto.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowDoubleClick = (params: GridRowParams) => {
    handleView(params.id as string);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSwitchToEdit = (id: string) => {
    handleCloseViewModal();
    handleEdit(id);
  };

  const handleDeleteFromView = (id: string) => {
    handleCloseViewModal();
    handleDelete(id);
  };
  
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
  
  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const newProjectId = event.target.value;
    if (newProjectId && newProjectId !== projectId) {
      navigate(`/projects/${newProjectId}/test-cases`);
    }
  };

  const filteredTestCases = useMemo(() => {
    return testCases.filter(tc => {
      const fullId = `${tc.project.prefix}-${tc.projectSequenceId}`;
      const searchLower = searchQuery.toLowerCase().trim();

      const searchMatch = searchLower === '' || 
        tc.title.toLowerCase().includes(searchLower) ||
        fullId.toLowerCase().includes(searchLower);
      
      const statusMatch = statusFilter === '' || tc.status === statusFilter;
      const priorityMatch = priorityFilter === '' || tc.priority === priorityFilter; 


      return searchMatch && statusMatch && priorityMatch;
    });
  }, [testCases, searchQuery, statusFilter, priorityFilter]);

  const columns: GridColDef<TestCaseType>[] = [
    { 
      field: 'projectSequenceId', 
      headerName: 'ID',
      width: 100,
      valueGetter: (_value, row) => `${row.project.prefix}-${row.projectSequenceId}`
    },
    { field: 'title', headerName: 'Caso de Teste', flex: 2 },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      valueGetter: (_value, row) => {
        const statusValue = row.status; 
        return statusValue ? statusValue.replace(/_/g, ' ') : 'N/A'; 
      }
    },
    { field: 'priority', headerName: 'Prioridade', flex: 1 },
    { 
      field: 'testType',
      headerName: 'Tipo de Teste', 
      flex: 1,
      valueGetter: (_value, row) => {
        if (row.customTestType && row.customTestType.name) {
          return row.customTestType.name;
        }
        if (row.testType) {
          return row.testType;
        }
        return 'N/A';
      }
    },
    {
      field: 'responsible',
      headerName: 'Responsável',
      flex: 1,
      valueGetter: (_value, row) => row.responsible?.name || 'Nenhum',
    },
    { field: 'estimatedTime', headerName: 'Tempo Est.', flex: 1 },
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
    return <PageLayout><Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress /></Box></PageLayout>;
  }

  return (
    <PageLayout>
      <title>Casos de Testes | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Casos de Teste</h1>
        <Button
          className='btn primary icon'
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<AddIcon />}
        >
          Adicionar Caso de Teste
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <section className='page-body'>
        <Box className='section-datagrid-filter'>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Projeto</InputLabel>
            <Select
              value={projectId || ''}
              label="Projeto"
              onChange={handleProjectChange}
            >
              {allProjects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            label="Pesquisa" 
            variant="outlined" 
            placeholder="ID, Título..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            autoComplete='off'
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={priorityFilter}
              label="Prioridade"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value=""><em>Todas</em></MenuItem>
              {Object.values(Priority).map(p => (
                <MenuItem key={String(p)} value={String(p)}>{String(p)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {filteredTestCases.length > 0 ? (
          <Box className="box-datagrid">
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid<TestCaseType>
                rows={filteredTestCases}
                columns={columns}
                getRowId={(row) => row.id!}
                onRowDoubleClick={handleRowDoubleClick}
                disableColumnFilter
                disableColumnMenu
                disableColumnResize
              />
            </div>
          </Box>
        ) : (
          <Box className="box-datagrid" height={ 600 }>
            <Typography variant='h6' align="center" style={{ position: 'relative', top: '50%'  }}>
              <strong>Nenhum caso de teste encontrado.</strong>
            </Typography>
          </Box>
        )}
      </section>

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

      {editingTestCaseId && project && (
        <EditTestCaseModal
          open={!!editingTestCaseId}
          testCaseId={editingTestCaseId}
          organizationId={project.organization.id} 
          handleClose={handleCloseEditModal}
          onSaveSuccess={fetchData}
        />
      )}

      {viewingTestCaseId && (
        <ViewTestCaseModal
          open={!!viewingTestCaseId}
          testCaseId={viewingTestCaseId}
          handleClose={handleCloseViewModal}
          onEdit={handleSwitchToEdit}
          onDelete={handleDeleteFromView}
        />
      )}
    </PageLayout>
  );
}