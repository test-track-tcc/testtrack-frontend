import { useEffect, useState } from 'react';
import {
    Button, TextField, Box, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Typography, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, ListItemButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { PermissionService } from '../../services/PermissionService';
import { type Permission } from '../../types/Permission';
import { type Organization } from '../../types/Organization';
import { type AccessGroup, type UpdateAccessGroupPayload, type CreateAccessGroupPayload } from '../../types/AcessGroup';
import { AccessGroupService } from '../../services/AccessGroupService';
import { type User } from '../../types/User';
import { OrganizationService } from '../../services/OrganizationService';

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

    useEffect(() => {
        setName(group?.name || '');
        setDescription(group?.description || '');
        setSelectedPermissions(new Set(group?.permissions?.map(p => p.id) || []));
    }, [group]);


    return (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }} className="group-acess-form">
            <Typography variant="h6">{group?.id ? 'Editar' : 'Novo'} Grupo de Acesso</Typography>
            <TextField label="Nome do Grupo" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" required />
            <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <Typography sx={{ mt: 2, mb: 1 }}>Permissões Disponíveis</Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                <FormGroup>
                    {allPermissions.map(perm => (<FormControlLabel key={perm.id} control={<Checkbox checked={selectedPermissions.has(perm.id)} onChange={() => handlePermissionToggle(perm.id)} />} label={perm.name} />))}
                    {allPermissions.length === 0 && <Typography variant="caption" sx={{ p: 1 }}>Nenhuma permissão encontrada. Cadastre na aba "Permissões".</Typography>}
                </FormGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                <Button onClick={handleSave} variant="contained" disabled={!name}>Salvar</Button>
            </Box>
        </Box>
    );
}

export default function AccessGroupManager({ organization }: { organization: Organization }) {
    const [groups, setGroups] = useState<AccessGroup[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingGroup, setEditingGroup] = useState<Partial<AccessGroup> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [usersToAdd, setUsersToAdd] = useState<Set<string>>(new Set());
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userError, setUserError] = useState('');

    const loadData = async () => {
        if (!organization?.id) {
            setGroups([]);
            setAllPermissions([]);
            return;
        }

        setLoading(true); setError('');
        try {
            const [groupsData, permissionsData] = await Promise.all([
                AccessGroupService.findAllInOrg(organization.id),
                PermissionService.findAllByOrg(organization.id) 
            ]);
            
            if (Array.isArray(groupsData)) {
                setGroups(groupsData.filter(g => g != null));
            } else {
                setGroups([]);
            }
            
            if (Array.isArray(permissionsData)) {
                setAllPermissions(permissionsData.filter(p => p != null));
            } else {
                setAllPermissions([]);
            }

        } catch (err: any) {
            setError(`Falha ao carregar dados: ${err.message || 'Erro desconhecido'}`);
            setGroups([]);
            setAllPermissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        loadData(); 
    }, [organization]); 

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este GRUPO?')) {
            try {
                await AccessGroupService.remove(id);
                loadData();
            } catch (err: any) {
                setError(`Falha ao remover grupo: ${err.message || 'Erro desconhecido'}`);
            }
        }
    };

    const handleSave = async (data: UpdateAccessGroupPayload, groupId?: string) => {
        if (!data.name?.trim()) {
            setError('O nome do grupo é obrigatório.');
            return;
        }
        setError(''); 

        try {
            if (groupId) {
                await AccessGroupService.update(groupId, data);
            } else {
                const payload: CreateAccessGroupPayload = {
                    ...data,
                    name: data.name, 
                    organizationId: organization.id,
                    createdById: (() => { 
                        const userData = localStorage.getItem('userData');
                        try {
                            return userData ? JSON.parse(userData).id ?? '' : '';
                        } catch {
                            return ''; 
                        }
                    })(),
                };
                await AccessGroupService.create(payload);
            }
            setIsFormOpen(false); setEditingGroup(null); loadData(); 
        } catch (err: any) {
            setError(`Falha ao salvar o grupo: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
        }
    };

    const openForm = (group: Partial<AccessGroup> | null = null) => { setEditingGroup(group); setIsFormOpen(true); setError(''); };
    const closeForm = () => { setIsFormOpen(false); setEditingGroup(null); setError(''); };


    const openUserModal = async (groupId: string) => {
        setSelectedGroupId(groupId);
        setIsUserModalOpen(true);
        setLoadingUsers(true);
        setUserError('');
        setUsersToAdd(new Set()); 
        try {
            const allOrgUsers = await OrganizationService.getUsers(organization.id);

            const groupData = await AccessGroupService.findOne(groupId); 

            const groupUserIds = new Set(
                groupData.users
                    .filter((u): u is User => u != null)
                    .map((u: User) => u.id) 
            );
            
            const usersNotInGroup = allOrgUsers
                .filter(user => user != null && !groupUserIds.has(user.id)); 
            
            setAvailableUsers(usersNotInGroup);
        } catch (err: any) {
            setUserError(`Erro ao buscar usuários: ${err.message || 'Erro desconhecido'}`);
            setAvailableUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedGroupId(null);
        setAvailableUsers([]);
        setUsersToAdd(new Set());
        setUserError('');
    };

    const handleUserToggle = (userId: string) => {
        const newSelection = new Set(usersToAdd);
        if (newSelection.has(userId)) {
            newSelection.delete(userId);
        } else {
            newSelection.add(userId);
        }
        setUsersToAdd(newSelection);
    };

    const handleAddUsers = async () => {
        if (!selectedGroupId || usersToAdd.size === 0) return;
        setLoadingUsers(true); 
        setUserError('');

        try {
            for (const userId of usersToAdd) {
                await AccessGroupService.addUser(selectedGroupId, userId);
            }
            closeUserModal();
            loadData();
        } catch (err: any) {
            setUserError(`Erro ao adicionar usuários: ${err.message || 'Erro desconhecido'}`);
        } finally {
            setLoadingUsers(false); 
        }
    };

    const handleRemoveUser = async (groupId: string, userId: string, userName: string) => {
        if (window.confirm(`Tem certeza que deseja remover "${userName}" deste grupo?`)) {
            try {
                await AccessGroupService.removeUser(groupId, userId);
                loadData();
            } catch (err: any) {
                setError(`Falha ao remover usuário: ${err.message || 'Erro desconhecido'}`);
            }
        }
    };

    return (
        <Box>
            {loading && <CircularProgress />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!isFormOpen && (
                 <Button onClick={() => openForm()} variant="contained" sx={{ my: 2 }}>Adicionar Grupo de Acesso</Button>
            )}

            {isFormOpen && <AccessGroupForm group={editingGroup} allPermissions={allPermissions} onSave={handleSave} onCancel={closeForm} />}

            <Box sx={{ mt: 2 }}>
                {groups.length === 0 && !loading && !isFormOpen && (
                    <Typography>Nenhum grupo de acesso encontrado para esta organização.</Typography>
                )}
                
                {groups.map((group) => ( 
                    <Accordion key={group.id} defaultExpanded={group.id === editingGroup?.id}> 
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                                <Typography fontWeight="bold">{group.name}</Typography>
                                <Box>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); openForm(group); }} aria-label={`Editar grupo ${group.name}`}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(group.id); }} aria-label={`Excluir grupo ${group.name}`}><DeleteIcon /></IconButton>
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={(e) => { e.stopPropagation(); openUserModal(group.id); }}
                                        sx={{ ml: 1 }}
                                        aria-label={`Adicionar usuários ao grupo ${group.name}`}
                                    >
                                        Usuários
                                    </Button>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{group.description || <i>Sem descrição</i>}</Typography>
                            
                            <Typography variant="subtitle2">Permissões:</Typography>
                            {group.permissions && group.permissions.length > 0 ? (
                                <List dense sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
                                    {group.permissions.map(p => <ListItem key={p.id} disablePadding><ListItemText primary={`- ${p.name}`} /></ListItem>)}
                                </List>
                            ) : (
                                <Typography variant="caption" sx={{ display: 'block', pl: 2, mb: 2 }}>Nenhuma permissão associada.</Typography>
                            )}

                             <Typography variant="subtitle2">Usuários no Grupo:</Typography>
                             {group.users && group.users.length > 0 ? (
                                <List dense sx={{ maxHeight: 150, overflowY: 'auto' }}>
                                    
                                    {group.users.filter((u): u is User => u != null && u.id != null).map((u: User) => (
                                        <ListItem 
                                            key={u.id} 
                                            disablePadding
                                            secondaryAction={
                                                <IconButton 
                                                    edge="end" 
                                                    aria-label="remover"
                                                    size="small"
                                                    onClick={() => handleRemoveUser(group.id, u.id!, u.name || 'Usuário')} 
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText 
                                                primary={`- ${u.name}`} 
                                                secondary={u.email}
                                                sx={{ pr: 6 }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="caption" sx={{ display: 'block', pl: 2 }}>Nenhum usuário neste grupo.</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Dialog open={isUserModalOpen} onClose={closeUserModal} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Usuários ao Grupo "{groups.find(g => g.id === selectedGroupId)?.name}"</DialogTitle>
                <DialogContent dividers> 
                    {loadingUsers && <CircularProgress />}
                    {userError && <Alert severity="error" sx={{ mb: 2 }}>{userError}</Alert>}
                    {!loadingUsers && !userError && (
                        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            {availableUsers.length > 0 ? availableUsers.filter(user => user.id != null).map(user => (
                                <ListItemButton key={user.id} onClick={() => handleUserToggle(user.id!)}>
                                    <Checkbox
                                        edge="start"
                                        checked={usersToAdd.has(user.id!)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText primary={user.name} secondary={user.email} />
                                </ListItemButton>
                            )) : (
                                <ListItem>
                                    <ListItemText primary="Nenhum usuário disponível para adicionar (todos já estão no grupo ou não há outros na organização)." />
                                </ListItem>
                            )}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUserModal}>Cancelar</Button>
                    <Button
                        onClick={handleAddUsers}
                        variant="contained"
                        disabled={loadingUsers || usersToAdd.size === 0}
                    >
                        {loadingUsers ? 'Adicionando...' : `Adicionar (${usersToAdd.size})`}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}