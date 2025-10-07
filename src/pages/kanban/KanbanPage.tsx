import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Box, Select, MenuItem, FormControl, InputLabel, TextField, Typography, Button, type SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase, TestCaseStatus, Priority, type UpdateTestCasePayload } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import KanbanCard from './KanbanCard';
import KanbanColumn from './KanbanColumn';
import ViewTestCaseModal from '../testCases/form/ViewTestCaseModal';
import CreateTestCaseModal from '../testCases/form/CreateTestCaseModal';
import EditTestCaseModal from '../testCases/form/EditTestCaseModal';

type Columns = {
  [key in TestCaseStatus]: TestCase[];
};

const columnTitles: { [key in TestCaseStatus]: string } = {
  NAO_INICIADO: 'Não Iniciado',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  BLOQUEADO: 'Bloqueado',
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CANCELADO: 'Cancelado',
};

export default function KanbanPage() {
  const { projectId, orgId } = useParams<{ projectId: string, orgId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectType | null>(null);
  const [allTestCases, setAllTestCases] = useState<TestCase[]>([]);
  const [columns, setColumns] = useState<Columns>({
    NAO_INICIADO: [], PENDENTE: [], EM_ANDAMENTO: [], BLOQUEADO: [],
    APROVADO: [], REPROVADO: [], CANCELADO: [], CONCLUIDO: [],
  });
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingTestCaseId, setViewingTestCaseId] = useState<string | null>(null);
  const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
  const fetchData = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [projectData, testCasesData] = await Promise.all([
        ProjectService.getById(projectId),
        TestCaseService.getByProjectId(projectId)
      ]);
      setProject(projectData);
      setAllTestCases(testCasesData);

      if (projectData?.organization?.id) {
        const organizationId = projectData.organization.id;
        const allProjectsData = await ProjectService.getProjectsByOrganization(organizationId);
        setAllProjects(allProjectsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const filteredTestCases = useMemo(() => {
    return allTestCases.filter(tc => {
      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = searchLower === '' ||
        tc.title.toLowerCase().includes(searchLower) ||
        `${tc.project.prefix}-${tc.projectSequenceId}`.toLowerCase().includes(searchLower);
      
      const statusMatch = statusFilter === '' || tc.status === statusFilter;
      const priorityMatch = priorityFilter === '' || tc.priority === priorityFilter;

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [allTestCases, searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    const newColumns: Columns = { NAO_INICIADO: [], PENDENTE: [], EM_ANDAMENTO: [], BLOQUEADO: [], APROVADO: [], REPROVADO: [], CANCELADO: [], CONCLUIDO: [] };
    filteredTestCases.forEach(tc => { if (newColumns[tc.status]) newColumns[tc.status].push(tc); });
    setColumns(newColumns);
  }, [filteredTestCases]);

  const handleOpenViewModal = (id: string) => setViewingTestCaseId(id);
  const handleCloseViewModal = () => setViewingTestCaseId(null);
  const handleOpenEditModal = (id: string) => setEditingTestCaseId(id);
  const handleCloseEditModal = () => setEditingTestCaseId(null);
  
  const handleSwitchToEdit = (id: string) => {
    handleCloseViewModal();
    handleOpenEditModal(id);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
      await TestCaseService.delete(id);
      fetchData();
      handleCloseViewModal();
    }
  };

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const newProjectId = event.target.value;
    if (newProjectId && newProjectId !== projectId && orgId) {
      navigate(`/organization/${orgId}/project/${newProjectId}/kanban`);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const destinationColumnId = over.id as TestCaseStatus;
    const sourceColumnId = Object.keys(columns).find(colId => 
        columns[colId as TestCaseStatus].some(c => c.id === activeId)
    ) as TestCaseStatus | undefined;
    if (!sourceColumnId || sourceColumnId === destinationColumnId) return;
    setAllTestCases(prev => prev.map(tc => 
      tc.id === activeId ? { ...tc, status: destinationColumnId } : tc
    ));
    try {
      const updatePayload: UpdateTestCasePayload = { status: destinationColumnId };
      await TestCaseService.update(activeId, updatePayload);
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
      setAllTestCases(prev => prev.map(tc => 
        tc.id === activeId ? { ...tc, status: sourceColumnId } : tc
      ));
    }
  };
  
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  return (
    <PageLayout>
      <title>Kanban | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Quadro Kanban</h1>
        <Button className='btn primary icon' startIcon={<AddIcon />} onClick={() => setIsCreateModalOpen(true)}>
          Adicionar Caso de Teste
        </Button>
      </Box>

      <Box className='section-datagrid-filter'>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Projeto</InputLabel>
          <Select value={projectId || ''} label="Projeto" onChange={handleProjectChange}>
            {allProjects.map((proj) => (
              <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField 
          label="Pesquisa" 
          placeholder="ID, Título..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          autoComplete='off'
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value=""><em>Todos</em></MenuItem>
            {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Prioridade</InputLabel>
          <Select value={priorityFilter} label="Prioridade" onChange={(e) => setPriorityFilter(e.target.value)}>
            <MenuItem value=""><em>Todas</em></MenuItem>
            {Object.values(Priority).map(p => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
          </Select>
        </FormControl>
      </Box>

      {loading ? ( <Typography sx={{ textAlign: 'center', mt: 4 }}>Carregando...</Typography> ) : ( 
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <Box className="kanban-container">
            {Object.entries(columns).map(([columnId, items]) => (
              (statusFilter === '' || statusFilter === columnId) && 
              <KanbanColumn key={columnId} id={columnId} title={columnTitles[columnId as TestCaseStatus]} items={items}>
                {items.map(item => (
                  <KanbanCard key={item.id} item={item} onClick={handleOpenViewModal} />
                ))}
              </KanbanColumn>
            ))}
          </Box>
        </DndContext>
      )}

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
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}
