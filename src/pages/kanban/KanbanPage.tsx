import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box, CircularProgress } from '@mui/material';
import { TestCaseService } from '../../services/TestCaseService';
import { type TestCase, type TestCaseStatus } from '../../types/TestCase';
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
  FALHA: 'Falha',
  BLOQUEADO: 'Bloqueado',
};

export default function KanbanPage() {
  const [columns, setColumns] = useState<Columns>({
    NAO_INICIADO: [],
    EM_ANDAMENTO: [],
    CONCLUIDO: [],
    FALHA: [],
    BLOQUEADO: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await TestCaseService.getByProjectId();
        const newColumns: Columns = {
          NAO_INICIADO: [],
          EM_ANDAMENTO: [],
          CONCLUIDO: [],
          FALHA: [],
          BLOQUEADO: [],
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
  }, []);

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
        return card ? [colId as StatusType, card] : acc;
      },
      [null, null] as [StatusType | null, TestFormData | null]
    );
  
    if (!sourceColumnId || !sourceCard) return;
  
    const destinationColumnId = Object.keys(columns).find(
        (colId) => colId === overId || columns[colId as StatusType].some(c => c.id === overId)
    ) as StatusType | undefined;
  
    if (!destinationColumnId) return;

    if (sourceColumnId !== destinationColumnId) {
        setColumns(prev => {
            const newColumns = { ...prev };
            
            newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(c => c.id !== activeId);
            
            // Adiciona na nova coluna
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
            await TestCaseService.update(activeId, destinationColumnId);
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);
            // Reverter o estado se a API falhar (opcional)
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
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', padding: 2 }}>
          {Object.entries(columns).map(([columnId, items]) => (
            <KanbanColumn key={columnId} id={columnId} title={columnTitles[columnId as StatusType]} items={items}>
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