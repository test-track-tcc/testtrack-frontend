import React from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PageLayout from '../components/PageLayout';
import TestCaseFormFunctions from '../functions/TestCaseFormFunctions';
import { useNavigate } from 'react-router-dom';

const TestForm: React.FC = () => {
    const {
        formData,
        handleChange,
        handleSelectChange,
        // setNewScript,
        // newScript,
        // addAttachment,
        // addScript,
        // removeAttachment,
        removeScript,
        handleSubmit,
        handleFileChange,
        // newAttachment,
        // setNewAttachment
    } = TestCaseFormFunctions();

    const navigate = useNavigate();

  return (
    <PageLayout>
        <section className="form">
            <Typography variant="h4" gutterBottom>
              Cadastro do Caso de Teste
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <TextField
                fullWidth
                label="Título"
                value={formData.titulo}
                onChange={handleChange('titulo')}
                required
                />

                <TextField
                fullWidth
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange('descricao')}
                multiline
                rows={4}
                required
                />

                <TextField
                fullWidth
                label="Responsável pelo Caso de Teste"
                value={formData.idResponsavel}
                onChange={handleChange('idResponsavel')}
                />
            
                <div className="flex-row">
                    <FormControl fullWidth>
                        <InputLabel>Tipo de Teste</InputLabel>
                        <Select
                            value={formData.tipoTeste}
                            onChange={handleSelectChange('tipoTeste')}
                            label="Tipo de Teste"
                            disabled
                        >
                            <MenuItem value="FUNCIONAL">Funcional</MenuItem>
                            <MenuItem value="USABILIDADE">Usabilidade</MenuItem>
                            <MenuItem value="DESEMPENHO">Desempenho</MenuItem>
                            <MenuItem value="SEGURANCA">Segurança</MenuItem>
                            <MenuItem value="REGRESSAO">Regressão</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Prioridade</InputLabel>
                        <Select
                            onChange={handleSelectChange('prioridade')}
                            label="Prioridade"
                        >
                            <MenuItem value="NENHUM">Nenhum</MenuItem> 
                            <MenuItem value="BAIXA">Baixa</MenuItem>
                            <MenuItem value="MEDIA">Média</MenuItem>
                            <MenuItem value="ALTA">Alta</MenuItem>
                            <MenuItem value="CRITICA">Crítica</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={formData.status}
                            onChange={handleSelectChange('status')}
                            label="Status"
                        >
                            <MenuItem value="NAO_INICIADO">Não Iniciado</MenuItem>
                            <MenuItem value="PENDENTE">Pendente</MenuItem>
                            <MenuItem value="EM_PROGRESSO">Em Progresso</MenuItem>
                            <MenuItem value="CONCLUIDO">Concluído</MenuItem>
                            <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
                            <MenuItem value="FALHA">Falha</MenuItem>
                            <MenuItem value="APROVADO">Aprovado</MenuItem>
                            <MenuItem value="REVISAO_PENDENTE">Revisão Pendente</MenuItem>
                            <MenuItem value="RETESTANDO">Retestando</MenuItem>
                            <MenuItem value="CANCELADO">Cancelado</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Tempo Estimado"
                        value={formData.tempoEstimado}
                        onChange={handleChange('tempoEstimado')}
                        placeholder="Ex: 1h30m"
                    />
                    
                    <TextField
                    fullWidth
                    label="Requisito Vinculado"
                    value={formData.requisitoVinculado}
                    onChange={handleChange('requisitoVinculado')}
                    />
                </div>
            
                <TextField
                fullWidth
                label="Passos do Teste"
                value={formData.steps}
                onChange={handleChange('steps')}
                multiline
                rows={4}
                placeholder="1. Passo um; 2. Passo dois; 3. Passo três;"
                required
                />
            
                <TextField
                fullWidth
                label="Resultado Esperado"
                value={formData.resultadoEsperado}
                onChange={handleChange('resultadoEsperado')}
                multiline
                rows={3}
                required
                />
            
                {/* <Typography variant="h6" gutterBottom>
                Anexos
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Novo Anexo (URL)"
                        value={newAttachment}
                        onChange={(e) => setNewAttachment(e.target.value)}
                    />
                    <IconButton color="primary" onClick={addAttachment}>
                        <AddIcon />
                    </IconButton>
                </Box>
            
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.anexos.map((anexo, index) => (
                        <Chip
                        key={index}
                        label={anexo}
                        onDelete={() => removeAttachment(index)}
                        deleteIcon={<DeleteIcon />}
                        avatar={<Avatar><AttachFileIcon /></Avatar>}
                        variant="outlined"
                        clickable
                        component="a"
                        href={anexo}
                        target="_blank"
                        />
                    ))}
                </Box> */}
            
                <Divider />
                <Typography variant="h6" gutterBottom>Scripts de Automação</Typography>
                <input
                    accept="*" // Ajuste para tipos de arquivo específicos se necessário (ex: ".js,.py")
                    style={{ display: 'none' }}
                    id="script-file-upload"
                    multiple 
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="script-file-upload">
                    <Button variant="outlined" component="span" startIcon={<AttachFileIcon />}>
                    Selecionar Script(s)
                    </Button>
                </label>
                <List dense>
                    {formData.scripts.map((file: { url: string; name: string }, index: number) => (
                        <ListItem
                            key={file.url + index}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => removeScript(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemIcon>
                                <AttachFileIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {file.name}
                                    </a>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            
                {/* <Box sx={{ mt: 2 }}>
                    {formData.scripts.map((script, index) => (
                        <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                        }}>
                            <IconButton size="small" onClick={() => removeScript(index)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" fontFamily="monospace">
                                {script}
                            </Typography>
                        </Box>
                    ))}
                </Box> */}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/testCase')}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Salvar Teste
                    </Button>
                </Box>

            </form>
        </section>
    </PageLayout>
  );
};

export default TestForm;