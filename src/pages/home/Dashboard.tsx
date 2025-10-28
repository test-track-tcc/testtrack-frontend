// src/pages/Dashboard.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { TestCaseService } from '../../services/TestCaseService';
import { ProjectService } from '../../services/ProjectService';
import { type TestCase as TestCaseType } from '../../types/TestCase';
import { type Project as ProjectType } from '../../types/Project';
import PageLayout from '../../components/layout/PageLayout';
import EditTestCaseModal from '../testCases/form/EditTestCaseModal';
import ViewTestCaseModal from '../testCases/form/ViewTestCaseModal';
import RealTimeTab from '../reports/RealtimeTab';

export default function Dashboard() {
    const { projectId } = useParams<{ projectId: string }>();
    const { orgId } = useParams<{ orgId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectType | null>(null);
    const [recentTestCases, setRecentTestCases] = useState<TestCaseType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingTestCaseId, setEditingTestCaseId] = useState<string | null>(null);
    const [viewingTestCaseId, setViewingTestCaseId] = useState<string | null>(null);

    const handleEdit = (id: string) => setEditingTestCaseId(id);
    const handleCloseEditModal = () => setEditingTestCaseId(null);
    const handleView = (id: string) => setViewingTestCaseId(id);
    const handleCloseViewModal = () => setViewingTestCaseId(null);

    const fetchData = async () => {
        if (!projectId) {
            setError("ID do projeto não encontrado.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');

            const projectData = await ProjectService.getById(projectId);
            setProject(projectData);

            const testCasesData = await TestCaseService.getByProjectId(projectId);

            const sortedTestCases = [...testCasesData].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setRecentTestCases(sortedTestCases.slice(0, 5));

        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            setError('Não foi possível carregar os dados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const handleRowDoubleClick = (params: GridRowParams) => {
        handleView(params.id as string);
    };

    const handleSwitchToEdit = (id: string) => {
        handleCloseViewModal();
        handleEdit(id);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este caso de teste?')) {
            try {
                await TestCaseService.delete(id);
                fetchData();
            } catch (err) {
                console.error('Erro ao deletar caso de teste:', err);
                setError('Falha ao excluir o caso de teste.');
            }
        }
    };

    const handleDeleteFromView = (id: string) => {
        handleCloseViewModal();
        handleDelete(id);
    };

    const columns: GridColDef<TestCaseType>[] = [
        {
            field: 'projectSequenceId',
            headerName: 'ID',
            width: 100,
            valueGetter: (_value, row) => `${row.project.prefix}-${row.projectSequenceId}`
        },
        { field: 'title', headerName: 'Caso de Teste', flex: 2 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            valueGetter: (_value, row) => row.status ? row.status.replace(/_/g, ' ') : 'N/A'
        },
        { field: 'priority', headerName: 'Prioridade', flex: 1 },
        {
            field: 'testType',
            headerName: 'Tipo de Teste',
            flex: 1,
            valueGetter: (_value, row) => (row.customTestType?.name || row.testType || 'N/A')
        },
        {
            field: 'responsible',
            headerName: 'Responsável',
            flex: 1,
            valueGetter: (_value, row) => row.responsible?.name || 'Nenhum',
        },
        { field: 'estimatedTime', headerName: 'Tempo Est.', flex: 1 },
    ];

    if (loading) {
        return (
            <PageLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <title>Dashboard | TestTrack</title>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight={'bold'}> 
                    {project && `${project.name}` || 'Área de Trabalho'}
                </Typography>
            </Box>

            <Paper sx={{ mb: 4, overflow: 'hidden' }} className="paper-dashboard">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}
                >
                    <Box>
                        <Typography variant="h6" component="h2" fontWeight={'bold'} mb={'8px'}>
                            Casos de Teste
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ultimas atualizações em seus casos de teste
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/organization/${orgId}/project/${projectId}/testCase`)} 
                    >
                        Ver todos
                    </Button>
                </Box>

                {recentTestCases.length > 0 ? (
                    <Box sx={{ width: '100%' }}>
                        <DataGrid<TestCaseType>
                            rows={recentTestCases}
                            columns={columns}
                            getRowId={(row) => row.id!}
                            onRowDoubleClick={handleRowDoubleClick}
                            disableColumnFilter
                            disableColumnMenu
                            disableColumnResize
                            hideFooter
                            autoHeight
                            sx={{
                                border: 0,
                                '& .MuiDataGrid-row:hover': {
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <Typography sx={{ p: 3, textAlign: 'center' }}>
                        Nenhum caso de teste encontrado para este projeto.
                    </Typography>
                )}
            </Paper>

            {projectId && <RealTimeTab projectId={projectId} />}

            {editingTestCaseId && project && (
                <EditTestCaseModal
                    open={!!editingTestCaseId}
                    testCaseId={editingTestCaseId}
                    organizationId={project.organization.id}
                    handleClose={handleCloseEditModal}
                    onSaveSuccess={() => {
                        fetchData();
                        handleCloseEditModal();
                    }}
                />
            )}

            {viewingTestCaseId && (
                <ViewTestCaseModal
                    open={!!viewingTestCaseId}
                    testCaseId={viewingTestCaseId}
                    handleClose={handleCloseViewModal}
                    onEdit={handleSwitchToEdit}
                    onDelete={handleDeleteFromView}
                />
            )}
        </PageLayout>
    );
}