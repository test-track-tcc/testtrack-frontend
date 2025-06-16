import React from 'react';
import PageLayout from '../components/PageLayout';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

// Definição dos tipos para os dados do caso de teste
interface TestCaseData {
  id: string; // É crucial ter um 'id' único para cada linha no DataGrid
  titulo: string;
  responsavel: string; // "Responsável pelo caso de teste"
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'NAO_INICIADO' | 'PENDENTE' | 'EM PROGRESSO' | 'CONCLUIDO' | 'BLOQUEADO' | 'FALHA' | 'APROVADO' | 'REVISAO_PENDENTE' | 'RETESTANDO' | 'CANCELADO';
  tempoEstimado: string; // Ex: "2h", "30min"
}

export default function TestCase() {
  const navigate = useNavigate();
  // Exemplo de dados (você substituirá isso por dados reais de uma API, etc.)
  const [testCases, setTestCases] = React.useState<TestCaseData[]>([
    { id: '1', titulo: 'Login de Usuário', responsavel: 'João Silva', prioridade: 'ALTA', status: 'PENDENTE', tempoEstimado: '1h' },
    { id: '2', titulo: 'Cálculo de Frete', responsavel: 'Maria Souza', prioridade: 'MEDIA', status: 'EM PROGRESSO', tempoEstimado: '2h30min' },
    { id: '3', titulo: 'Validação de Formulário', responsavel: 'Carlos Lima', prioridade: 'BAIXA', status: 'CONCLUIDO', tempoEstimado: '45min' },
    { id: '4', titulo: 'Processamento de Pagamento', responsavel: 'Ana Paula', prioridade: 'CRITICA', status: 'FALHA', tempoEstimado: '3h' },
  ]);

  // Função para lidar com a edição de um caso de teste
  const handleEdit = (id: string) => {
    console.log(`Editar caso de teste com ID: ${id}`);
    // Aqui você implementaria a lógica para abrir um modal de edição ou navegar para uma página de edição
  };

  // Função para lidar com a exclusão de um caso de teste
  const handleDelete = (id: string) => {
    console.log(`Deletar caso de teste com ID: ${id}`);
    // Filtra os casos de teste, removendo o que foi deletado
    setTestCases(prev => prev.filter(testCase => testCase.id !== id));
  };

  // Definição das colunas do DataGrid
  const columns: GridColDef[] = [
    { field: 'titulo', headerName: 'Título', width: 250, editable: false },
    { field: 'responsavel', headerName: 'Responsável', width: 180, editable: false },
    { field: 'prioridade', headerName: 'Prioridade', width: 130, editable: false },
    { field: 'status', headerName: 'Status', width: 150, editable: false },
    { field: 'tempoEstimado', headerName: 'Tempo Estimado', width: 150, editable: false },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<TestCaseData>) => (
        <Box>
          <IconButton
            color="primary"
            aria-label="editar"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="deletar"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageLayout>
      <div className='flex-row'>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Casos de Teste
        </Typography>

        <Button className='btn primary' variant="contained" color="primary" onClick={() => navigate('/addTestCases')}>
            <AddIcon />
            <span>Adicionar Caso de Teste</span>
        </Button>
      </div>
      <div style={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={testCases}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </PageLayout>
  );
}