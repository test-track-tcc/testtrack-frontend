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
      <Typography variant="body2" color="text.secondary" >
        {item.priority}
      </Typography>
      <div>
        <Typography variant="body1">{`${item.project.prefix}-${item.projectSequenceId}`}</Typography>
        <Typography variant="body1">{item.title}</Typography>
      </div>
      <Typography variant="body1">{item.estimatedTime}</Typography>
    </Paper>
  );
}