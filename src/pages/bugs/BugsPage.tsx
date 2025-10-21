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
  const [targetBugId, setTargetBugId] = useState<string | null>(null); // ID do bug para abrir o modal
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
          // Idealmente filtrar no backend: await BugsService.getAllBugs({ projectId: currentProjectId });
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
      // Descomente se precisar filtrar no frontend e o backend não suportar
      // const projectMatch = !selectedProjectId || bug.testCase?.project?.id === selectedProjectId;
      // if (!projectMatch) return false;

      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = searchLower === '' || 
        bug.title.toLowerCase().includes(searchLower); 
      
      const statusMatch = statusFilter === '' || bug.status === statusFilter;
      const priorityMatch = priorityFilter === '' || bug.priority === priorityFilter; 

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [bugs, /* selectedProjectId, */ searchQuery, statusFilter, priorityFilter]); 

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const newProjectId = event.target.value;
    if (orgId && newProjectId) {
      setSelectedProjectId(newProjectId); 
      navigate(`/organization/${orgId}/project/${newProjectId}/bugs`); 
    }
  };

  // Abre o modal de visualização/edição (sempre começa em visualização)
  const handleOpenModal = (id: string) => {
    setTargetBugId(id);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setTargetBugId(null);
  };
  
  // Chamado após salvar status no modal
  const handleStatusUpdated = () => {
    // Recarrega os dados da lista
    const reloadBugs = async () => {
       if (!selectedProjectId && !routeProjectId) return; 
       const projectIdToLoad = selectedProjectId || routeProjectId; 
       if (!projectIdToLoad) return;

       try {
           setIsLoading(true); 
           // Idealmente filtrar no backend: await BugsService.getAllBugs({ projectId: projectIdToLoad });
           const bugsData = await BugsService.getAllBugs(); 
           setBugs(bugsData);
       } catch (err:any) {setError(err.message || 'Erro ao recarregar');}
       finally { setIsLoading(false); }
    };
    reloadBugs();
    // O modal ViewBugModal agora controla internamente se permanece aberto ou fecha
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
    // Coluna de ações foi removida, a ação é pelo duplo clique
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
        {/* Barra de Filtros */}
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
            columns={columns} // Coluna de ações removida
            getRowId={(row) => row.id}
            loading={isLoading}
            disableColumnFilter disableColumnMenu
            localeText={{ noRowsLabel: 'Nenhum defeito encontrado.' }}
            sx={{ '--DataGrid-overlayHeight': '300px' }} // Adicionado cursor pointer
            onRowDoubleClick={(params: GridRowParams) => handleOpenModal(params.id as string)} // Duplo clique chama handleOpenModal
          />
        </Box>
      </section>

      {/* Renderiza o ÚNICO modal */}
      {targetBugId && (
          <ViewBugModal
              open={!!targetBugId}
              bugId={targetBugId}
              handleClose={handleCloseModal} // Função única para fechar
              onStatusUpdated={handleStatusUpdated} // Passa a função de recarregar
              // startInEditMode não é mais necessário aqui
          />
      )}

    </PageLayout>
  );
}

export default BugsPage;