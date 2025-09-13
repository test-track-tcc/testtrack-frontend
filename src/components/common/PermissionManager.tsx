import { useEffect, useState } from 'react';
import {
  Button, TextField, Box, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PermissionService } from '../../services/PermissionService';
import { type Permission, type CreatePermissionPayload } from '../../types/Permission';
import { type Organization } from '../../types/Organization';
import { type Project } from '../../types/Project';
import { ProjectService } from '../../services/ProjectService';

// Formulário para criar/editar uma permissão
function PermissionForm({
    permission,
    projects,
    onSave,
    onCancel,
}: {
    permission: Partial<Permission> | null;
    projects: Project[];
    onSave: (data: Omit<CreatePermissionPayload, 'createdById'>) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(permission?.name || '');
    const [description, setDescription] = useState(permission?.description || '');
    const [projectId, setProjectId] = useState(''); // Estado para o projeto selecionado

    const handleSave = () => {
        if (!name || !projectId) {
            alert('Nome e Projeto são obrigatórios.');
            return;
        }
        onSave({ name, description, projectId });
    };

    return (
        <Box sx={{ my: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6">{permission?.id ? 'Editar' : 'Nova'} Permissão</Typography>
            <TextField label="Nome da Permissão" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Projeto</InputLabel>
                <Select
                    value={projectId}
                    label="Projeto"
                    onChange={(e) => setProjectId(e.target.value)}
                    disabled={!!permission?.id} // Desabilita a troca de projeto na edição
                >
                    {projects.map(proj => (
                        <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Salvar</Button>
            </Box>
        </Box>
    );
}

// Componente principal para gerenciar permissões
export default function PermissionManager({ organization }: { organization: Organization }) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingPermission, setEditingPermission] = useState<Partial<Permission> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [perms, projs] = await Promise.all([
                PermissionService.findAllByOrg(organization.id),
                ProjectService.findAllInOrg(organization.id)
            ]);
            if (Array.isArray(perms)) setPermissions(perms);
            if (Array.isArray(projs)) setProjects(projs);
        } catch (err) {
            setError('Falha ao carregar permissões ou projetos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [organization]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await PermissionService.remove(id);
                loadData();
            } catch (err) {
                setError('Falha ao remover permissão.');
            }
        }
    };

    const handleSave = async (data: Omit<CreatePermissionPayload, 'createdById'>) => {
        try {
            if (editingPermission?.id) {
                await PermissionService.update(editingPermission.id, { name: data.name, description: data.description });
            } else {
                const payload: CreatePermissionPayload = {
                    ...data,
                    createdById: 'mock-user-id', // TODO: Substituir pelo ID do usuário logado
                };
                await PermissionService.create(payload);
            }
            setIsFormOpen(false);
            setEditingPermission(null);
            loadData();
        } catch (err) {
            setError('Falha ao salvar permissão.');
        }
    };

    const openForm = (permission: Partial<Permission> | null = null) => {
        setEditingPermission(permission);
        setIsFormOpen(true);
    };

    return (
        <Box>
            {loading && <CircularProgress />}
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            
            <Button onClick={() => openForm()} variant="contained" sx={{ my: 2 }}>
                Adicionar Permissão
            </Button>

            {isFormOpen && (
                <PermissionForm
                    permission={editingPermission}
                    projects={projects}
                    onSave={handleSave}
                    onCancel={() => { setIsFormOpen(false); setEditingPermission(null); }}
                />
            )}

            <List sx={{ mt: 2 }}>
                {permissions.map((perm) => (
                    <ListItem key={perm.id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => openForm(perm)}><EditIcon /></IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(perm.id)}><DeleteIcon /></IconButton>
                        </>
                    }>
                        <ListItemText primary={perm.name} secondary={perm.description} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}