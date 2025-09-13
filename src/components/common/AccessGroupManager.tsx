import { useEffect, useState } from 'react';
import {
  Button, TextField, Box, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Typography, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PermissionService } from '../../services/PermissionService';
import { type Permission } from '../../types/Permission';
import { type Organization } from '../../types/Organization';
import { type AccessGroup, type UpdateAccessGroupPayload, type CreateAccessGroupPayload } from '../../types/AcessGroup';
import { AccessGroupService } from '../../services/AccessGroupService';


// Componente de formulário para criar/editar grupos
function AccessGroupForm({ group, allPermissions, onSave, onCancel }: { group: Partial<AccessGroup> | null; allPermissions: Permission[]; onSave: (data: UpdateAccessGroupPayload, groupId?: string) => void; onCancel: () => void; }) {
    const [name, setName] = useState(group?.name || '');
    const [description, setDescription] = useState(group?.description || '');
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set(group?.permissions?.map(p => p.id) || []));

    const handlePermissionToggle = (permissionId: string) => {
        const newSelection = new Set(selectedPermissions);
        newSelection.has(permissionId) ? newSelection.delete(permissionId) : newSelection.add(permissionId);
        setSelectedPermissions(newSelection);
    };

    const handleSave = () => {
        if (!name) return;
        const payload: UpdateAccessGroupPayload = { name, description, permissionIds: Array.from(selectedPermissions) };
        onSave(payload, group?.id);
    };

    return (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h6">{group?.id ? 'Editar' : 'Novo'} Grupo de Acesso</Typography>
            <TextField label="Nome do Grupo" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <Typography sx={{mt: 2, mb: 1}}>Permissões Disponíveis</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                <FormGroup>
                    {allPermissions.map(perm => (<FormControlLabel key={perm.id} control={<Checkbox checked={selectedPermissions.has(perm.id)} onChange={() => handlePermissionToggle(perm.id)} />} label={perm.name} />))}
                    {allPermissions.length === 0 && <Typography variant="caption" sx={{p: 1}}>Nenhuma permissão encontrada. Cadastre na aba "Permissões".</Typography>}
                </FormGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Salvar</Button>
            </Box>
        </Box>
    );
}

// O gerenciador de grupos de acesso
export default function AccessGroupManager({ organization }: { organization: Organization }) {
    const [groups, setGroups] = useState<AccessGroup[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingGroup, setEditingGroup] = useState<Partial<AccessGroup> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadData = async () => {
        setLoading(true); setError('');
        try {
            const [groupsData, permissionsData] = await Promise.all([
                AccessGroupService.findAllInOrg(organization.id),
                PermissionService.findAllByOrg(organization.id)
            ]);
            if (Array.isArray(groupsData)) setGroups(groupsData);
            if (Array.isArray(permissionsData)) setAllPermissions(permissionsData);
        } catch (err) { setError('Falha ao carregar dados.'); } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, [organization]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza?')) {
            try { await AccessGroupService.remove(id); loadData(); } catch (err) { setError('Falha ao remover grupo.'); }
        }
    };

    const handleSave = async (data: UpdateAccessGroupPayload, groupId?: string) => {
        try {
            if (groupId) {
                await AccessGroupService.update(groupId, data);
            } else {
                const payload: CreateAccessGroupPayload = { ...data, name: data.name!, organizationId: organization.id, createdById: 'mock-user-id' };
                await AccessGroupService.create(payload);
            }
            setIsFormOpen(false); setEditingGroup(null); loadData();
        } catch (err) { setError('Falha ao salvar o grupo.'); }
    };
    
    const openForm = (group: Partial<AccessGroup> | null = null) => { setEditingGroup(group); setIsFormOpen(true); };

    return (
        <Box>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            <Button onClick={() => openForm()} variant="contained" sx={{ my: 2 }}>Adicionar Grupo de Acesso</Button>
            {isFormOpen && <AccessGroupForm group={editingGroup} allPermissions={allPermissions} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingGroup(null); }} />}
            <Box sx={{ mt: 2 }}>
                {groups.map((group) => (
                    <Accordion key={group.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                                <Typography fontWeight="bold">{group.name}</Typography>
                                <Box>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); openForm(group); }}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(group.id); }}><DeleteIcon /></IconButton>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>{group.description}</Typography>
                            <Typography variant="subtitle2">Permissões:</Typography>
                            <List dense>
                                {group.permissions.map(p => <ListItem key={p.id}><ListItemText primary={p.name} /></ListItem>)}
                                {group.permissions.length === 0 && <Typography variant="caption" sx={{pl: 2}}>Nenhuma permissão associada.</Typography>}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
}