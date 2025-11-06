import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Imports corretos
import { DataGrid, type GridRenderCellParams, type GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  type SelectChangeEvent
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { type Project } from '../../types/Project';
import { type Report } from '../../types/Report';
import { ProjectService } from '../../services/ProjectService';
import { ReportService } from '../../services/ReportService';

const formatDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ReportsTab() {
  const { orgId, projectId } = useParams<{ orgId: string, projectId: string }>(); 
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([])
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [generationProjectId, setGenerationProjectId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');


  const fetchData = async () => {
    if (!projectId || !orgId) {
      setError("ID da organização ou do projeto não encontrado.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      setGenerationSuccess('');

      const [projectsData, reportsData] = await Promise.all([
        ProjectService.getProjectsByOrganization(orgId),
        ReportService.getByProjectId(projectId) 
      ]);
      
      setProjects(projectsData);
      setReports(reportsData);

      setGenerationProjectId(projectId); 

    } catch (err) {
      console.error("Erro ao carregar dados da página:", err);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, orgId]);

  const handleGenerateReport = async () => {
    if (!generationProjectId || !startDate || !endDate) {
      setError("Por favor, selecione um projeto e um intervalo de datas.");
      return;
    }
    setIsGenerating(true);
    setError('');
    setGenerationSuccess('');
    try {
      const response = await ReportService.generatePersonalized(
        generationProjectId,
        new Date(startDate),
        new Date(endDate)
      );
      setGenerationSuccess(response.message || "Geração iniciada. Atualize a lista em instantes.");
      setStartDate('');
      setEndDate('');
      setTimeout(() => {
        if (generationProjectId === projectId) {
          fetchData();
        }
      }, 3000); 
    } catch (err) {
      setError("Falha ao iniciar a geração do relatório.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    if (!report || !report.id || !report.fileName) {
      setError("Informações do relatório inválidas para download.");
      return;
    }
    try {
        await ReportService.downloadReport(report.id, report.fileName);
        setError(''); 
    } catch (err) {
        console.error(`Erro ao baixar o relatório ${report.fileName}:`, err);
        setError(`Falha ao baixar o arquivo ${report.fileName}.`);
    }
  };

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
      const newProjectId = event.target.value;
      if (newProjectId && newProjectId !== projectId) {
          navigate(`/organization/${orgId}/project/${newProjectId}/reports`); 
      }
  };

  const displayedReports = useMemo(() => {
    return reports.filter(report => {
      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = searchLower === '' ||
        (report.fileName && report.fileName.toLowerCase().includes(searchLower)) ||
        (report.project && report.project.name && report.project.name.toLowerCase().includes(searchLower));

      return searchMatch;
    });
  }, [reports, searchQuery]);

  const columns: GridColDef<Report>[] = [
    { 
      field: 'fileName', 
      headerName: 'Nome do Arquivo',
      flex: 2 
    },
    { 
      field: 'project', 
      headerName: 'Projeto', 
      flex: 1,
      valueGetter: (_value, row) => row.project?.name || 'N/A'
    },
    { 
      field: 'generatedAt', 
      headerName: 'Data de Geração', 
      flex: 1,
      valueGetter: (_value, row) => formatDate(row.generatedAt)
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.5,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: (params: GridRenderCellParams<Report>) => (
        <Box>
          <IconButton onClick={() => handleDownloadReport(params.row)} color="primary">
            <DownloadIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <><Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress /></Box></>;
  }

  return (
    <>
      <title>Relatórios | TestTrack</title>
    
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {generationSuccess && <Alert severity="success" sx={{ mb: 2 }}>{generationSuccess}</Alert>}

       <Card sx={{ mb: 3 }}>
         <CardContent>
           <Typography variant="h6" component="h2" mb={2} fontWeight={'bold'}>
             Gerar Novo Relatório Personalizado
           </Typography>
           <Grid container spacing={2} alignItems="flex-end">
             <Grid> 
               <FormControl sx={{ minWidth: 200 }} variant="outlined" fullWidth>
                  <InputLabel>Projeto</InputLabel> 
                  <Select
                    value={generationProjectId}
                    label="Projeto"
                    onChange={(e) => setGenerationProjectId(e.target.value)} 
                  >
                    {projects.map((proj) => (
                      <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
             </Grid>
             <Grid> 
               <TextField fullWidth label="Data de Início" type="date" value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 InputLabelProps={{ shrink: true }} variant="outlined" />
             </Grid>
              <Grid> 
               <TextField fullWidth label="Data de Fim" type="date" value={endDate}
                 onChange={(e) => setEndDate(e.target.value)}
                 InputLabelProps={{ shrink: true }} variant="outlined" />
             </Grid>
             <Grid> 
               <Button fullWidth variant="contained" onClick={handleGenerateReport}
                 disabled={isGenerating}
                 startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
                 sx={{ height: '56px' }} >
                 {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
               </Button>
             </Grid>
           </Grid>
         </CardContent>
       </Card>

      <section className='page-body'>
        
        <Box className='section-datagrid-filter'>
          <FormControl sx={{ minWidth: 200 }} variant="outlined">
            <InputLabel>Projeto</InputLabel>
            <Select
              value={projectId || ''}
              label="Projeto" 
              onChange={handleProjectChange}
            >
              {projects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            label="Pesquisa" 
            variant="outlined" 
            placeholder="Nome do arquivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            autoComplete='off'
          />
        </Box>
        
        {displayedReports.length > 0 ? (
          <Box className="box-datagrid">
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid<Report>
                rows={displayedReports}
                columns={columns}
                getRowId={(row) => row.id!}
                disableColumnFilter
                disableColumnMenu
                disableColumnResize
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'generatedAt', sort: 'desc' }],
                  },
                }}
              />
            </div>
          </Box>
        ) : (
          <Box className="box-datagrid" height={ 600 } sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h6' align="center">
              <strong>Nenhum relatório encontrado para este projeto.</strong>
            </Typography>
          </Box>
        )}
      </section>
    </>
  );
}