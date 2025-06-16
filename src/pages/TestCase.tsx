import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton, Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { type TestFormData } from '../functions/TestCaseFormFunctions'; // Importa a interface
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TestCase() {
  const navigate = useNavigate();

  const [testCases, setTestCases] = useState<TestFormData[]>([]);

  useEffect(() => {
    const storedTestCases = localStorage.getItem('testCases');
    if (storedTestCases) {
      try {
        const parsedTestCases: TestFormData[] = JSON.parse(storedTestCases);
        const hydratedTestCases = parsedTestCases.map((tc) => ({
          ...tc,
          comentarios: tc.comentarios.map((c) => ({
            ...c,
            data: new Date(c.data),
          })),
          scripts: tc.scripts.map(({ url, name }) => ({ url, name, file: null })), // file: null agora é compatível com ScriptFile
        }));
        setTestCases(hydratedTestCases);
      } catch (error) {
        console.error("Erro ao carregar casos de teste do localStorage:", error);
        setTestCases([]);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = testCases.map(tc => ({
      ...tc,
      scripts: tc.scripts.map(({ url, name }) => ({ url, name })),
    }));
    localStorage.setItem('testCases', JSON.stringify(dataToSave));
  }, [testCases]);

  const handleEdit = (id: string) => {
    console.log(`Editar caso de teste com ID: ${id}`);
    navigate(`/addTestCases?id=${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
      console.log(`Deletar caso de teste com ID: ${id}`);
      setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
    }
  };

  const columns: GridColDef[] = [
    { field: 'titulo', headerName: 'Título', width: 250, editable: false },
    {
      field: 'idResponsavel',
      headerName: 'Responsável',
      width: 180,
      editable: false,
    },
    { field: 'prioridade', headerName: 'Prioridade', width: 130, editable: false },
    { field: 'status', headerName: 'Status', width: 150, editable: false },
    { field: 'tempoEstimado', headerName: 'Tempo Estimado', width: 150, editable: false },
    {
      field: 'dataCriacao',
      headerName: 'Criação',
      width: 150,
      editable: false,
      valueGetter: (params: { row: TestFormData }) => {
        const rawDate = params.row.comentarios[0]?.data;
        return rawDate ? format(rawDate, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A';
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<TestFormData>) => (
        <Box>
          <IconButton
            color="primary"
            aria-label="editar"
            onClick={() => handleEdit(params.row.id!)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="deletar"
            onClick={() => handleDelete(params.row.id!)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Casos de Teste
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/addTestCases')}
          startIcon={<AddIcon />}
        >
          Adicionar Caso de Teste
        </Button>
      </Box>

      {testCases.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 5 }}>
          Nenhum caso de teste cadastrado ainda. Crie um novo!
        </Typography>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={testCases}
            columns={columns}
            getRowId={(row) => row.id!}
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
      )}
    </PageLayout>
  );
}