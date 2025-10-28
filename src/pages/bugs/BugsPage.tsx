import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { 
  Box, Typography,
  Select, MenuItem, FormControl, InputLabel, Alert,
  type SelectChangeEvent, TextField
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid'; 

import { BugsService } from '../../services/BugsService';
import { type Bug, BugStatus } from '../../types/Bug';
import { ProjectService } from '../../services/ProjectService'; 
import { type Project } from '../../types/Project'; 
import { Priority } from '../../types/TestCase';
import PageLayout from '../../components/layout/PageLayout'; 
import ViewBugModal from './modal/ViewBugModal';

function BugsPage() {
  const { orgId, projectId: routeProjectId } = useParams<{ orgId: string, projectId: string }>(); 
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(''); 
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [targetBugId, setTargetBugId] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [statusFilter, setStatusFilter] = useState(''); 
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!orgId) return; 

      setIsLoading(true); setError(null);
      try {
        const projectsData = await ProjectService.getProjectsByOrganization(orgId);
        setAllProjects(projectsData);

        const currentProjectId = routeProjectId && projectsData.some(p => p.id === routeProjectId) 
          ? routeProjectId 
          : projectsData[0]?.id || '';
        setSelectedProjectId(currentProjectId);

        if (currentProjectId) {
          const bugsData = await BugsService.getAllBugs();
          setBugs(bugsData); 
        } else {
           setBugs([]);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
        console.error("Erro fetchData:", err);
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, [orgId, routeProjectId]); 

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const projectMatch = !selectedProjectId || bug.testCase?.project?.id === selectedProjectId;
      if (!projectMatch) return false;

      console.log(selectedProjectId);

      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = searchLower === '' || 
        bug.title.toLowerCase().includes(searchLower); 
      
      const statusMatch = statusFilter === '' || bug.status === statusFilter;
      const priorityMatch = priorityFilter === '' || bug.priority === priorityFilter; 

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [bugs, selectedProjectId, searchQuery, statusFilter, priorityFilter]);

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const newProjectId = event.target.value;
    if (orgId && newProjectId) {
      setSelectedProjectId(newProjectId); 
      navigate(`/organization/${orgId}/project/${newProjectId}/bugs`); 
    }
  };

  const handleOpenModal = (id: string) => {
    setTargetBugId(id);
  };

  const handleCloseModal = () => {
    setTargetBugId(null);
  };
  
  const handleStatusUpdated = () => {
    const reloadBugs = async () => {
       if (!selectedProjectId && !routeProjectId) return; 
       const projectIdToLoad = selectedProjectId || routeProjectId; 
       if (!projectIdToLoad) return;

       try {
           setIsLoading(true); 
           const bugsData = await BugsService.getAllBugs(); 
           setBugs(bugsData);
       } catch (err:any) {setError(err.message || 'Erro ao recarregar');}
       finally { setIsLoading(false); }
    };
    reloadBugs();
  };

  const columns: GridColDef<Bug>[] = [
    { field: 'title', headerName: 'Título', flex: 2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'priority', headerName: 'Prioridade', flex: 1 },
    { 
      field: 'testCase', headerName: 'Caso de Teste', flex: 1.5,
      valueGetter: (_value, row) => row.testCase?.title || 'N/A' 
    },
    { 
      field: 'assignedDeveloper', headerName: 'Responsável', flex: 1.5,
      valueGetter: (_value, row) => row.assignedDeveloper?.name || 'Ninguém'
    },
  ];

  if (!orgId) return <PageLayout><Alert severity="warning">Organização não encontrada na URL.</Alert></PageLayout>;

  return (
    <PageLayout>
      <title>Defeitos | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          Lista de Defeitos
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <section className='page-body'>
        <Box className='section-datagrid-filter' sx={{ mb: 2 }}>
           <FormControl sx={{ minWidth: 200 }}>
             <InputLabel>Projeto</InputLabel>
             <Select
               value={isLoading ? '' : selectedProjectId} 
               label="Projeto"
               onChange={handleProjectChange}
               disabled={isLoading || allProjects.length === 0}
             >
               {allProjects.map((proj) => (
                 <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
               ))}
             </Select>
           </FormControl>

          <TextField 
            label="Pesquisa" variant="outlined" placeholder="Título..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }} autoComplete='off' disabled={isLoading}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)} disabled={isLoading}>
              <MenuItem value=""><em>Todos</em></MenuItem>
              {Object.values(BugStatus).map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Prioridade</InputLabel>
            <Select value={priorityFilter} label="Prioridade" onChange={(e) => setPriorityFilter(e.target.value)} disabled={isLoading}>
              <MenuItem value=""><em>Todas</em></MenuItem>
              {Object.values(Priority).map(p => ( 
                <MenuItem key={String(p)} value={String(p)}>{String(p)}</MenuItem> 
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* DataGrid com duplo clique para abrir o modal */}
        <Box className="box-datagrid" sx={{ height: 600, width: '100%' }}>
          <DataGrid<Bug>
            rows={filteredBugs}
            columns={columns}
            getRowId={(row) => row.id}
            loading={isLoading}
            disableColumnFilter disableColumnMenu
            localeText={{ noRowsLabel: 'Nenhum defeito encontrado.' }}
            sx={{ '--DataGrid-overlayHeight': '300px' }}
            onRowDoubleClick={(params: GridRowParams) => handleOpenModal(params.id as string)}
          />
        </Box>
      </section>

      {/* Renderiza o ÚNICO modal */}
      {targetBugId && (
          <ViewBugModal
              open={!!targetBugId}
              bugId={targetBugId}
              handleClose={handleCloseModal}
              onStatusUpdated={handleStatusUpdated}
          />
      )}

    </PageLayout>
  );
}

export default BugsPage;