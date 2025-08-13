import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import type { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { Box, Button, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseService } from '../../services/TestCaseService';
import { type TestFormData } from '../../types/TestCase';
import PageLayout from '../../components/layout/PageLayout';

export default function TestCase() {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState<TestFormData[]>([]);

  const fetchTestCases = async () => {
    try {
      const data = await TestCaseService.getAllTestes();
      // setTestCases(data);
    } catch (error) {
      console.error('Erro ao buscar casos de teste:', error);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
      try {
        // await testCasesApi.createTeste(id);
        // fetchTestCases();
      } catch (error) {
        console.error('Erro ao deletar caso de teste:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/addTestCase?id=${id}`);
  };

  const columns: GridColDef[] = [
    { field: 'titulo', headerName: 'Título', flex: 2, minWidth: 150,},
    { field: 'idResponsavel', headerName: 'Responsável', flex: 1.5, minWidth: 120 },
    { field: 'prioridade', headerName: 'Prioridade', flex: 1, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
    { field: 'tempoEstimado', headerName: 'Tempo Estimado'  },
    {
      field: 'actions',
      headerName: 'Ações',

      renderCell: (params: GridRenderCellParams<TestFormData>) => (
        <Box>
          <IconButton color='info' onClick={() => handleEdit(params.row.id!)}>
            <EditIcon />
          </IconButton>
          <IconButton color='error' onClick={() => handleDelete(params.row.id!)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageLayout>
      <title>Casos de Testes | TestTrack</title>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }} className="page-header">
        <h1>Gerenciamento de Casos de Teste</h1>
        <Button
          className='btn primary icon'
          onClick={() => navigate('/addTestCase')}
          startIcon={<AddIcon />}
        >
          Adicionar Caso de Teste
        </Button>
      </Box>

      {testCases.length === 0 ? (
        <Typography align="center" sx={{ mt: 5 }}>
          Nenhum caso de teste cadastrado ainda.
        </Typography>
      ) : (
        <div style={{ height: 600 }}>
          <DataGrid
            rows={testCases}
            columns={columns}
            getRowId={(row) => row.id!}
            paginationModel={{ pageSize: 10, page: 0 }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            disableColumnResize
          />
        </div>
      )}
    </PageLayout>
  );
}
