// src/pages/TestForm.tsx
import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
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
    addComment,
    removeComment,
    addAttachment,
    removeAttachment,
    removeScript,
    handleSubmit,
    handleFileChange,
    newComment,
    setNewComment,
    newAttachment,
    setNewAttachment,
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
            margin="normal"
          />

          <TextField
            fullWidth
            label="Descrição"
            value={formData.descricao}
            onChange={handleChange('descricao')}
            multiline
            rows={4}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Responsável pelo Caso de Teste"
            value={formData.idResponsavel}
            onChange={handleChange('idResponsavel')}
            margin="normal"
          />

          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
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
                value={formData.prioridade}
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
          </Box>

          <TextField
            fullWidth
            label="Requisito Vinculado"
            value={formData.requisitoVinculado}
            onChange={handleChange('requisitoVinculado')}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Passos do Teste"
            value={formData.steps}
            onChange={handleChange('steps')}
            multiline
            rows={4}
            placeholder="1. Passo um; 2. Passo dois; 3. Passo três;"
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Resultado Esperado"
            value={formData.resultadoEsperado}
            onChange={handleChange('resultadoEsperado')}
            multiline
            rows={3}
            required
            margin="normal"
          />

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Comentários
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Novo Comentário"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={addComment}>
              Adicionar
            </Button>
          </Box>
          <List dense>
            {formData.comentarios.map((comment, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeComment(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={comment.comentario}
                  secondary={`Por: ${comment.idUsuario} em ${new Date(comment.data).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Anexos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Novo Anexo (URL)"
              value={newAttachment}
              onChange={(e) => setNewAttachment(e.target.value)}
            />
            <Button variant="contained" onClick={addAttachment}>
              Adicionar
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.anexos.map((anexo, index) => (
              <Chip
                key={index}
                label={anexo.length > 30 ? `${anexo.substring(0, 27)}...` : anexo}
                onDelete={() => removeAttachment(index)}
                deleteIcon={<DeleteIcon />}
                avatar={<Avatar><AttachFileIcon /></Avatar>}
                variant="outlined"
                clickable
                component="a"
                href={anexo}
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Scripts de Automação
          </Typography>
          <input
            accept="*"
            style={{ display: 'none' }}
            id="script-file-upload"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="script-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Selecionar Script(s)
            </Button>
          </label>
          <List dense>
            {formData.scripts.map((file, index) => (
              <ListItem
                key={file.url + index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeScript(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <AttachFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {file.name}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/test-cases')}
            >
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