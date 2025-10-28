import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import type { TestCase } from '../../types/TestCase';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: TestCase[];
  children: React.ReactNode;
}

export default function KanbanColumn({ id, title, children, items }: KanbanColumnProps) {
  const itemIds = useMemo(() => items.map(item => item.id!), [items]);

  const { setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      type: 'Column',
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        width: 300,
        minWidth: 300,
        padding: 2,
        backgroundColor: '#f4f5f7',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {title}
      </Typography>
      <SortableContext items={itemIds}>
        {children}
      </SortableContext>
    </Paper>
  );
}