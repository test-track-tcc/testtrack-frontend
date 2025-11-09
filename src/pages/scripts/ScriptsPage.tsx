import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Tooltip,
    Link as MuiLink,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PageLayout from '../../components/layout/PageLayout';
import { type Script } from '../../types/Script';
import { ScriptService } from '../../services/ScriptsService';
import { TestCaseStatus, Priority } from '../../types/TestCase';
import { type Project } from '../../types/Project';
import { ProjectService } from '../../services/ProjectService';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ScriptsPage() {
    const { orgId, projectId } = useParams<{
        orgId: string;
        projectId: string;
    }>();
    const [scripts, setScripts] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            if (!orgId) return; 
            setProjectsLoading(true);
            try {
                const projectsData = await ProjectService.getProjectsByOrganization(orgId);
                setAllProjects(projectsData);
            } catch (err) {
                console.error("Falha ao buscar projetos:", err);
                setError(prev => prev + " Falha ao carregar lista de projetos.");
            } finally {
                setProjectsLoading(false);
            }
        };

        const fetchScripts = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await ScriptService.getAllByProject(projectId ?? '');

                if (Array.isArray(data)) {
                    setScripts(data);
                } else if (data && Array.isArray((data as any).data)) {
                    setScripts((data as any).data);
                } else if (data && Array.isArray((data as any).items)) {
                    setScripts((data as any).items);
                } else if (data == null) {
                    setScripts([]);
                } else {
                    console.warn('Resposta inesperada ao buscar scripts:', data);
                    setScripts([]);
                    setError('Resposta inesperada do servidor ao carregar scripts.');
                }
            } catch (err) {
                setError('Falha ao carregar os scripts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
        fetchScripts();
    }, [projectId, orgId]);

    const getFileName = (path?: string | null) => {
        if (!path) return '';
        return path.split(/[\\/]/).pop() || path;
    };

    const safeScripts = Array.isArray(scripts) ? scripts : [];

    const filteredScripts = useMemo(() => {
        return safeScripts.filter(script => {
            const searchLower = searchQuery.toLowerCase().trim();
            const fileName = getFileName(script.scriptPath).toLowerCase();
            const testCase = script.testCase;
            const project = testCase?.project;

            const testCaseFullId = project ? `${project.prefix ?? ''}-${testCase?.projectSequenceId ?? ''}`.toLowerCase() : '';
            const testCaseTitle = testCase?.title?.toLowerCase() ?? '';

            const searchMatch = searchLower === '' ||
                fileName.includes(searchLower) ||
                (testCaseFullId && testCaseFullId.includes(searchLower)) ||
                testCaseTitle.includes(searchLower);

            const statusMatch = statusFilter === '' || testCase?.status === statusFilter;
            const priorityMatch = priorityFilter === '' || String(testCase?.priority) === String(priorityFilter);

            return searchMatch && statusMatch && priorityMatch;
        });
    }, [safeScripts, searchQuery, statusFilter, priorityFilter]);

    const handleProjectChange = (event: SelectChangeEvent<string>) => {
        const newProjectId = event.target.value;
        if (newProjectId && newProjectId !== projectId && orgId) {
            navigate(`/organization/${orgId}/project/${newProjectId}/scripts`);
        }
    };

    const columns: GridColDef<Script>[] = [
        {
            field: 'scriptPath',
            headerName: 'Script',
            flex: 2,
            valueGetter: (_value, row) => getFileName(row.scriptPath),
        },
        {
            field: 'version',
            headerName: 'Versão',
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'testCase',
            headerName: 'Caso de Teste',
            flex: 3,
            renderCell: (params: GridRenderCellParams<Script>) => (
                <MuiLink
                    component={Link}
                    to={`/organization/${orgId}/project/${params.row.testCase?.project?.id ?? projectId}/testCase`}
                >
                    {`${params.row.testCase?.project?.prefix ?? '---'}-${params.row.testCase?.projectSequenceId ?? ''} ${params.row.testCase?.title ?? 'Caso de Teste não encontrado'}`}
                </MuiLink>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params: GridRenderCellParams<Script>) => {
                const status = params.row.status;
                return status ? status.replace(/_/g, ' ') : 'N/A';
            }
        },
        {
            field: 'createdAt',
            headerName: 'Data de Upload',
            flex: 1.5,
            valueGetter: (_value, row) => row.createdAt ? new Date(row.createdAt) : null,
            renderCell: (params: GridRenderCellParams<Script, Date | null>) => {
                return params.value ? format(params.value, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '---';
            },
        },
        {
            field: 'actions',
            headerName: 'Download',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params: GridRenderCellParams<Script>) => (
                <Tooltip title="Baixar script">
                    <IconButton
                        href={params.row.scriptPath || undefined}
                        target="_blank"
                        component="a"
                        download
                        disabled={!params.row.scriptPath}
                    >
                        <FileDownloadIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    const statusValues = useMemo(() => {
        return (TestCaseStatus && typeof TestCaseStatus === 'object')
            ? Object.values(TestCaseStatus) as string[]
            : [];
    }, []);

    const priorityValues = useMemo(() => {
        return (Priority && typeof Priority === 'object')
            ? Object.values(Priority).map(p => String(p))
            : [];
    }, []);

    if (loading) {
        return <PageLayout><Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box></PageLayout>;
    }

    return (
        <PageLayout>
            <title>Scripts | TestTrack</title>
            <Box>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold', marginBottom: '18px'}} gutterBottom>
                    Scripts
                </Typography>

                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

                <Box className='section-datagrid-filter' sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Projeto</InputLabel>
                        <Select
                            value={projectId || ''} // Usa o projectId da URL
                            label="Projeto"
                            onChange={handleProjectChange}
                            disabled={projectsLoading} // Desabilita enquanto carrega projetos
                        >
                            {allProjects.length === 0 && !projectsLoading && (
                                <MenuItem value="" disabled>Nenhum projeto encontrado</MenuItem>
                            )}
                            {allProjects.map((proj) => (
                                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Pesquisa"
                        variant="outlined"
                        placeholder="Nome script, ID ou Título do CT..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flexGrow: 1, minWidth: '250px' }}
                        autoComplete='off'
                    />

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Status do CT</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status do CT"
                            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)} // Corrigido o tipo do evento
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            {statusValues.map(s => <MenuItem key={s} value={s}>{String(s).replace('_', ' ')}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Prioridade do CT</InputLabel>
                        <Select
                            value={priorityFilter}
                            label="Prioridade do CT"
                            onChange={(e: SelectChangeEvent) => setPriorityFilter(e.target.value)} 
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {priorityValues.map(p => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {!error && (
                    <Box className="box-datagrid" sx={{ height: 600, width: '100%' }}>
                        {filteredScripts.length > 0 ? (
                            <DataGrid<Script>
                                rows={filteredScripts ?? []}
                                columns={columns}
                                getRowId={(row) => row.id}
                                disableColumnFilter
                                disableColumnMenu
                            />
                        ) : (
                            !loading && (
                                <Typography variant='h6' align="center" sx={{ position: 'relative', top: '40%' }}>
                                    <strong>Nenhum script encontrado com os filtros aplicados.</strong>
                                </Typography>
                            )
                        )}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
}