import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box, Button, IconButton, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, TextField, type SelectChangeEvent } from '@mui/material';
import { TestCaseService } from '../../services/TestCaseService';
import { type TestCase, type TestCaseStatus, type UpdateTestCasePayload } from '../../types/TestCase';
import PageLayout from '../../components/layout/PageLayout';
import KanbanCard from './KanbanCard';
import KanbanColumn from './KanbanColumn';

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
  const { projectId } = useParams<{ projectId: string }>();
  const [columns, setColumns] = useState<Columns>({
    NAO_INICIADO: [],
    PENDENTE: [],
    EM_ANDAMENTO: [],
    BLOQUEADO: [],
    APROVADO: [],
    REPROVADO: [],
    CANCELADO: [],
    CONCLUIDO: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        if (!projectId) {
          setLoading(false);
          return;
        }
        const data = await TestCaseService.getByProjectId(projectId);
        const newColumns: Columns = {
          NAO_INICIADO: [],
          PENDENTE: [],
          EM_ANDAMENTO: [],
          BLOQUEADO: [],
          APROVADO: [],
          REPROVADO: [],
          CANCELADO: [],
          CONCLUIDO: [],
        };
        data.forEach(tc => {
          if (newColumns[tc.status]) {
            newColumns[tc.status].push(tc);
          }
        });
        setColumns(newColumns);
      } catch (error) {
        console.error('Erro ao buscar casos de teste:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const [sourceColumnId, sourceCard] = Object.entries(columns).reduce(
      (acc, [colId, cards]) => {
        const card = cards.find(c => c.id === activeId);
        return card ? [colId as TestCaseStatus, card] : acc;
      },
      [null, null] as [TestCaseStatus | null, TestCase | null]
    );

    if (!sourceColumnId || !sourceCard) return;

    const destinationColumnId = Object.keys(columns).find(
        (colId) => colId === overId || columns[colId as TestCaseStatus].some(c => c.id === overId)
    ) as TestCaseStatus | undefined;

    if (!destinationColumnId) return;

    if (sourceColumnId !== destinationColumnId) {
        setColumns(prev => {
            const newColumns = { ...prev };
            
            newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(c => c.id !== activeId);
            
            const overCardIndex = newColumns[destinationColumnId].findIndex(c => c.id === overId);
            const newCard = { ...sourceCard, status: destinationColumnId };
            
            if (overCardIndex !== -1) {
                newColumns[destinationColumnId].splice(overCardIndex, 0, newCard);
            } else {
                newColumns[destinationColumnId].push(newCard);
            }
            
            return newColumns;
        });

        try {
            const updatePayload: UpdateTestCasePayload = { status: destinationColumnId };
            await TestCaseService.update(activeId, updatePayload);
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);
        }
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <title>Kanban | TestTrack</title>
      <h1>Quadro Kanban</h1>

        <Box className='section-datagrid-filter'>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Projeto</InputLabel>
            <Select
              value={projectId || ''}
              label="Projeto"
              // onChange={handleProjectChange}
            >
              {/* {allProjects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
              ))} */}
            </Select>
          </FormControl>
          
          <TextField 
            label="Pesquisa" 
            variant="outlined" 
            placeholder="ID, Título..." 
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              // value={statusFilter}
              label="Status"
              // onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {/* {Object.values(TestCaseStatus).map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>)} */}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} disabled>
            <InputLabel>Script</InputLabel>
            <Select value="" label="Script">
              <MenuItem value=""><em>Todos</em></MenuItem>
            </Select>
          </FormControl>
        </Box>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <Box className="kanban-container">
          {Object.entries(columns).map(([columnId, items]) => (
            <KanbanColumn key={columnId} id={columnId} title={columnTitles[columnId as TestCaseStatus]} items={items}>
              {items.map(item => (
                <KanbanCard key={item.id} item={item} />
              ))}
            </KanbanColumn>
          ))}
        </Box>
      </DndContext>
    </PageLayout>
  );
}