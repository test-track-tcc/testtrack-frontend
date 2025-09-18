import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography } from '@mui/material';
import type { TestCase } from '../../types/TestCase';

interface KanbanCardProps {
  item: TestCase;
}

export default function KanbanCard({ item }: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id!,
    data: {
      type: 'Card',
      item,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        padding: 2,
        marginBottom: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="body1">{item.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        Prioridade: {item.priority}
      </Typography>
    </Paper>
  );
}