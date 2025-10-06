import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box, Select, MenuItem, FormControl, InputLabel, TextField, Typography, Button, type SelectChangeEvent } from '@mui/material';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase, TestCaseStatus, Priority, type UpdateTestCasePayload } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import KanbanCard from './KanbanCard';
import KanbanColumn from './KanbanColumn';
import AddIcon from '@mui/icons-material/Add';

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

  // Estados para os dados
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

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const projectData = await ProjectService.getById(projectId);
        if (projectData?.organization?.id) {
          const organizationId = projectData.organization.id;
          const [testCasesData, allProjectsData] = await Promise.all([
            TestCaseService.getByProjectId(projectId),
            ProjectService.getProjectsByOrganization(organizationId),
          ]);
          setAllTestCases(testCasesData);
          setAllProjects(allProjectsData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [projectId]);

  // Aplica todos os filtros
  const filteredTestCases = useMemo(() => {
    return allTestCases.filter(tc => {
      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = searchLower === '' ||
        tc.title.toLowerCase().includes(searchLower) ||
        `${tc.project.prefix}-${tc.projectSequenceId}`.toLowerCase().includes(searchLower);

      const statusMatch = statusFilter === '' || tc.status === statusFilter; // <-- LÓGICA DO FILTRO DE STATUS
      const priorityMatch = priorityFilter === '' || tc.priority === priorityFilter;

      return searchMatch && statusMatch && priorityMatch; // <-- CONDIÇÃO INCLUÍDA
    });
  }, [allTestCases, searchQuery, statusFilter, priorityFilter]); // <-- DEPENDÊNCIA ADICIONADA

  // Distribui os casos de teste filtrados nas colunas
  useEffect(() => {
    const newColumns: Columns = {
      NAO_INICIADO: [], PENDENTE: [], EM_ANDAMENTO: [], BLOQUEADO: [],
      APROVADO: [], REPROVADO: [], CANCELADO: [], CONCLUIDO: [],
    };
    filteredTestCases.forEach(tc => {
      if (newColumns[tc.status]) {
        newColumns[tc.status].push(tc);
      }
    });
    setColumns(newColumns);
  }, [filteredTestCases]);

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const newProjectId = event.target.value;
    if (newProjectId && newProjectId !== projectId && orgId) {
      navigate(`/organization/${orgId}/project/${newProjectId}/kanban`);
    }
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

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

  return (
    <PageLayout>
      <title>Kanban | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1>Quadro Kanban</h1>
        <Button className='btn primary icon' startIcon={<AddIcon />}>
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
        
        {/* FILTRO DE STATUS ADICIONADO CORRETAMENTE */}
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
          <Select value={priorityFilter} label="Prioridade" onChange={(e) => setPriorityFilter(e.target.value)}>
            <MenuItem value=""><em>Todas</em></MenuItem>
            {Object.values(Priority).map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h6">Carregando casos de teste...</Typography>
        </Box>
      ) : ( 
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <Box className="kanban-container">
            {Object.entries(columns).map(([columnId, items]) => (
              (statusFilter === '' || statusFilter === columnId) && 
              <KanbanColumn key={columnId} id={columnId} title={columnTitles[columnId as TestCaseStatus]} items={items}>
                {items.map(item => (
                  <KanbanCard key={item.id} item={item} />
                ))}
              </KanbanColumn>
            ))}
          </Box>
        </DndContext>
      )}
    </PageLayout>
  );
}