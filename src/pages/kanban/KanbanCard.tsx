import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Box, Chip, Avatar, Tooltip } from '@mui/material';
import { type TestCase, Priority, TestType } from '../../types/TestCase';

const priorityColors: { [key in Priority]: 'error' | 'warning' | 'info' | 'success' | 'default' } = {
  [Priority.CRITICAL]: 'error',
  [Priority.HIGH]: 'error',
  [Priority.MEDIUM]: 'warning',
  [Priority.LOW]: 'info',
  [Priority.NONE]: 'default',
};

const typeColors: { [key in TestType]?: 'primary' | 'secondary' | 'default' } = {
    [TestType.FUNCIONAL]: 'primary',
    [TestType.REGRESSAO]: 'secondary',
    [TestType.ACEITACAO]: 'primary',
};


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
    id: item.id,
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

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        mb: 1.5,
        backgroundColor: 'white',
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary">
          {`${item.project.prefix}-${item.projectSequenceId}`}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
          {item.title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          label={item.priority}
          color={priorityColors[item.priority] || 'default'}
          size="small"
        />
        {item.testType && (
          <Chip
            label={item.testType}
            color={typeColors[item.testType] || 'default'}
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {item.estimatedTime ? `Est: ${item.estimatedTime} min` : ''}
        </Typography>

        {item.responsible ? (
            <Tooltip title={item.responsible.name}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                    {getInitials(item.responsible.name ?? '')}
                </Avatar>
            </Tooltip>
        ) : (
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.300' }} />
        )}
      </Box>
    </Paper>
  );
}