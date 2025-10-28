import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartService } from '../../services/ChartService';
import { type TestStatusMetrics } from '../../types/Metrics';
import { TestType } from '../../types/TestCase';

ChartJS.register(ArcElement, Tooltip, Legend);

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || '';
          if (label) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = total === 0 ? 0 : ((value / total) * 100).toFixed(0);
            return `${label}: ${value} (${percentage}%)`;
          }
          return '';
        }
      }
    }
  },
  cutout: '70%',
};

const testTypeLabels: Record<string, string> = {
  FUNCIONAL: 'Funcional',
  REGRESSAO: 'Regressão',
  DESEMPENHO: 'Desempenho',
  SEGURANCA: 'Segurança',
  USABILIDADE: 'Usabilidade',
  INTEGRACAO: 'Integração',
  ACEITACAO: 'Aceitação',
  AUTOMATIZADO: 'Automatizado',
  MANUAL: 'Manual',
};

const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

interface RealTimeTabProps {
  projectId: string;
}

export default function RealTimeTab({ projectId }: RealTimeTabProps) {
  const theme = useTheme();
  const [period, setPeriod] = useState('mensal');
  const [testType, setTestType] = useState('total');
  const [metrics, setMetrics] = useState<TestStatusMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) {
      setError("ID do Projeto não encontrado.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await ChartService.getTestStatusMetrics(projectId, period, testType);
        setMetrics(data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados em tempo real.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, period, testType]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Buscando dados em tempo real...</Typography>
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (!metrics || metrics.total === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum dado de teste encontrado para os filtros selecionados.
          </Typography>
        </Box>
      );
    }

    const successPercentage = metrics.total === 0 ? 0 : ((metrics.success / metrics.total) * 100).toFixed(0);
    const failurePercentage = metrics.total === 0 ? 0 : ((metrics.failure / metrics.total) * 100).toFixed(0);
    const inProgressPercentage = metrics.total === 0 ? 0 : ((metrics.inProgress / metrics.total) * 100).toFixed(0);
    const notStartedPercentage = metrics.total === 0 ? 0 : ((metrics.notStarted / metrics.total) * 100).toFixed(0);

    const pieChartData = {
      labels: ['Sucesso', 'Falha', 'Em Andamento', 'Não Iniciados'],
      datasets: [
        {
          data: [metrics.success, metrics.failure, metrics.inProgress, metrics.notStarted],
          backgroundColor: [
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main,
          ],
          hoverBackgroundColor: [
            theme.palette.success.dark,
            theme.palette.error.dark,
            theme.palette.warning.dark,
            theme.palette.info.dark,
          ],
          borderWidth: 0,
        },
      ],
    };

    return (
      <>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" fontWeight="bold">{metrics.total}</Typography>
                <Typography variant="h6">Testes</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <List>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${metrics.success} com sucesso`}
                  secondary={`${successPercentage}% testes passaram com sucesso`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${metrics.failure} com falha`}
                  secondary={`${failurePercentage}% testes passaram com falha`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.warning.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${metrics.inProgress} em andamento`}
                  secondary={`${inProgressPercentage}% testes estão em andamento`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.info.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${metrics.notStarted} não iniciados`}
                  secondary={`${notStartedPercentage}% testes não foram iniciados`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        {/* Você pode remover os botões comentados ou ajustá-los */}
        {/* <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button variant="contained">
            Download do relatório
          </Button>
        </Box> */}
      </>
    );
  };

  return (
    <Card sx={{ mt: 2, p: 2, borderRadius: theme.shape.borderRadius }} className="paper-dashboard">
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between" mb={2}>
          <Grid>
            <Typography variant="h6" component="h2" gutterBottom fontWeight={'bold'}>
              Relatórios de Testes (em tempo real)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acompanhe o progresso dos seus testes aqui
            </Typography>
          </Grid>
          <Grid container justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
            <Grid>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="period-select-label">Período</InputLabel>
                <Select
                  labelId="period-select-label"
                  value={period}
                  label="Período"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="diario">Diário</MenuItem>
                  Â                 <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="mensal">Mensal</MenuItem>
                  <MenuItem value="total">Total</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ minWidth: 150, ml: 1 }}>
                <InputLabel id="test-type-select-label">Tipo de Teste</InputLabel>
                <Select
                  labelId="test-type-select-label"
                  value={testType}
                  label="Tipo de Teste"
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <MenuItem value="total">Total de Testes</MenuItem>

                  {Object.values(TestType).map((type) => (
                    <MenuItem
                      key={type}
                      value={type.toLowerCase()}
                    >
                      {testTypeLabels[type] || capitalize(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {renderContent()}

      </CardContent>
    </Card>
  );
}