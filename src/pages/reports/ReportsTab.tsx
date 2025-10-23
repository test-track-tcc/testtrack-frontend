import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { type Project } from '../../types/Project';
import { type Report } from '../../types/Report';
import { ProjectService } from '../../services/ProjectService';
import { ReportService } from '../../services/ReportService';

// Função helper para formatar data
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ReportsTab() {
  const { orgId } = useParams<{ orgId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generationProjectId, setGenerationProjectId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState('');
  const [filterProjectId, setFilterProjectId] = useState<string>('');

  const fetchData = async () => {
    if (!orgId) {
      setError("ID da organização não encontrado.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      setGenerationSuccess('');

      const projectsData = await ProjectService.getProjectsByOrganization(orgId);
      setProjects(projectsData);
      
      const projectIds = new Set(projectsData.map(p => p.id));
      const allReportsData = await ReportService.getAll();
      const orgReports = allReportsData.filter(report => 
        projectIds.has(report.project.id)
      );
      
      setReports(orgReports);

    } catch (err) {
      console.error("Erro ao carregar dados da página:", err);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleGenerateReport = async () => {
    if (!generationProjectId || !startDate || !endDate) {
      setError("Por favor, selecione um projeto e um intervalo de datas para gerar o relatório.");
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
      setGenerationSuccess(response.message || "Geração de relatório iniciada. Atualize a lista em alguns instantes.");
      setGenerationProjectId('');
      setStartDate('');
      setEndDate('');
      setTimeout(() => {
        fetchData();
      }, 3000); 
    } catch (err) {
      setError("Falha ao iniciar a geração do relatório.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
        await ReportService.downloadReport(report.id, report.fileName);
    } catch (err) {
        setError(`Falha ao baixar o arquivo ${report.fileName}.`);
    }
  };

  const displayedReports = useMemo(() => {
    if (!filterProjectId) {
      return reports;
    }
    return reports.filter(report => report.project.id === filterProjectId);
  }, [reports, filterProjectId]);

  if (loading && reports.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Carregando relatórios...</Typography>
      </Box>
    );
  }

  // Note: Sem PageLayout ou <title>
  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {generationSuccess && <Alert severity="success" sx={{ mb: 2 }}>{generationSuccess}</Alert>}

      <Grid>
        {/* SEÇÃO DE GERAÇÃO */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Gerar Novo Relatório Personalizado
              </Typography>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid>
                  <FormControl fullWidth>
                    <InputLabel id="project-generate-label">Projeto</InputLabel>
                    <Select
                      labelId="project-generate-label"
                      value={generationProjectId}
                      label="Projeto"
                      onChange={(e) => setGenerationProjectId(e.target.value)}
                    >
                      {projects.map(project => (
                        <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Data de Início"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Data de Fim"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    startIcon={isGenerating ? <CircularProgress size={20} /> : null}
                  >
                    {isGenerating ? 'Gerando...' : 'Gerar'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2 }}>
            Relatórios Gerados
          </Typography>
          <Paper>
            <Box sx={{ p: 2 }}>
              <FormControl sx={{ minWidth: 240 }}>
                <InputLabel id="project-filter-label">Filtrar por Projeto</InputLabel>
                <Select
                  labelId="project-filter-label"
                  value={filterProjectId}
                  label="Filtrar por Projeto"
                  onChange={(e) => setFilterProjectId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todos os Projetos</em>
                  </MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome do Arquivo</TableCell>
                    <TableCell>Projeto</TableCell>
                    <TableCell>Data de Geração</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedReports.length > 0 ? (
                    displayedReports.map(report => (
                      <TableRow key={report.id}>
                        <TableCell>{report.fileName}</TableCell>
                        <TableCell>{report.project.name}</TableCell>
                        <TableCell>{formatDate(report.generatedAt)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDownloadReport(report)} color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Nenhum relatório encontrado {filterProjectId ? 'para este projeto.' : 'nesta organização.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}