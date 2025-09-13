import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogContent, DialogTitle, TextField, Box, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomTestTypeService } from '../../services/CustomTypeService';
import { type CustomTestType, type CreateTestTypePayload, type UpdateTestTypePayload } from '../../types/CustomTestType';
import { type Organization } from '../../types/Organization';

function TestTypeForm({ type, onSave, onCancel }: { type: Partial<CustomTestType> | null; onSave: (data: UpdateTestTypePayload) => void; onCancel: () => void; }) {
    const [name, setName] = useState(type?.name || '');
    const [description, setDescription] = useState(type?.description || '');

    const handleSave = () => {
        if (!name) return;
        onSave({ name, description });
    };

    return (
        <Box sx={{ my: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }} className="group-acess-form">
            <Typography variant="h6">{type?.id ? 'Editar' : 'Novo'} Tipo de Teste</Typography>
            <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Salvar</Button>
            </Box>
        </Box>
    );
}

export default function ManageTestTypesModal({ open, onClose, organization }: { open: boolean; onClose: () => void; organization: Organization }) {
    const [types, setTypes] = useState<CustomTestType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingType, setEditingType] = useState<Partial<CustomTestType> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadData = async () => {
        setLoading(true); setError('');
        try {
            const data = await CustomTestTypeService.findAllByOrg(organization.id);
            if(Array.isArray(data)) setTypes(data);
        } catch (err) { setError('Falha ao carregar os tipos de teste.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (open) loadData(); }, [open]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza?')) return;
        try { await CustomTestTypeService.remove(organization.id, id); loadData(); }
        catch (err) { setError('Falha ao remover o tipo de teste.'); }
    };

    const handleSave = async (data: UpdateTestTypePayload) => {
        try {
            if (editingType?.id) {
                await CustomTestTypeService.update(organization.id, editingType.id, data);
            } else {
                await CustomTestTypeService.create(organization.id, data as CreateTestTypePayload);
            }
            setIsFormOpen(false); setEditingType(null); loadData();
        } catch (err) { setError('Falha ao salvar o tipo de teste.'); }
    };
    
    const openForm = (type: Partial<CustomTestType> | null = null) => {
        setEditingType(type);
        setIsFormOpen(true);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Gerenciar Tipos de Teste: {organization.name}</DialogTitle>
            <DialogContent>
                {loading && <CircularProgress />}
                {error && <Alert severity="error">{error}</Alert>}
                <Button onClick={() => openForm()} variant="contained" sx={{ my: 2 }}>
                    Adicionar Tipo de Teste
                </Button>
                {isFormOpen && <TestTypeForm type={editingType} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingType(null); }} />}
                <List sx={{ mt: 2 }}>
                    {types.map((type) => (
                        <ListItem key={type.id} secondaryAction={<><IconButton onClick={() => openForm(type)}><EditIcon /></IconButton><IconButton onClick={() => handleDelete(type.id)}><DeleteIcon /></IconButton></>}>
                            <ListItemText primary={type.name} secondary={type.description} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}