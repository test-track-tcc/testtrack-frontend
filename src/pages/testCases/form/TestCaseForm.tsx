import { Box, Button, MenuItem, Select, TextField, Paper, FormControl, InputLabel } from '@mui/material';
import TestCaseFormFunctions from '../../../functions/TestCaseFormFunctions';
import { type TestType } from '../../../types/TestTypes';
import { type PriorityType } from '../../../types/TestTypes';
import { type StatusType } from '../../../types/TestTypes';
import { type ScriptFile } from '../../../types/ScriptFile';
import PageLayout from '../../../components/layout/PageLayout';
import ScriptUpload from '../../../components/common/ScriptUpload';
import { GridDownloadIcon } from '@mui/x-data-grid';
import DocIcon from "../../../assets/doc-icon.svg?react";
import { useNavigate } from 'react-router-dom';

export default function TestCaseForm() {
  const {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = TestCaseFormFunctions();

  const tipos: TestType[] = ['FUNCIONAL', 'USABILIDADE', 'DESEMPENHO', 'SEGURANCA', 'REGRESSAO'];
  const prioridades: PriorityType[] = ['NENHUM', 'BAIXA', 'MEDIA', 'ALTA', 'CRITICA'];
  const statusList: StatusType[] = [
  'NAO_INICIADO',
  'PENDENTE',
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'BLOQUEADO',
  'FALHA',
  'APROVADO',
  'REVISAO_PENDENTE',
  'RETESTANDO',
  'CANCELADO',
  ];

  const navigate = useNavigate();

  return (    
    <PageLayout>
      <title>Cadastro de Caso de Teste | TestTrack</title>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h1>Cadastro de Caso de Teste</h1>

        <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 2}}>
          <TextField
            label="Título"
            value={formData.titulo}
            onChange={handleChange('titulo')}
            required
            autoComplete='off'
          />
          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={handleChange('descricao')}
            multiline
            rows={3}
            autoComplete='off'
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="tipo-teste-label">Tipo de Teste</InputLabel>
              <Select
                labelId="tipo-teste-label"
                value={formData.tipoTeste}
                onChange={handleSelectChange('tipoTeste')}
                label="Tipo de Teste"
              >
                {tipos.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="prioridades-label">Prioridades</InputLabel>
              <Select
                labelId="prioridades-label"
                label="Prioridade"
                value={formData.prioridade}
                onChange={handleSelectChange('prioridade')}
              >
                <MenuItem value="" disabled>Prioridade</MenuItem>
                {prioridades.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId='status-label'
                label="Status"
                value={formData.status}
                onChange={handleSelectChange('status')}
              >
                <MenuItem value="" disabled>Status</MenuItem>
                {statusList.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Responsável pelo Caso de Teste"
            value={formData.idResponsavel}
            onChange={handleChange('idResponsavel')}
            autoComplete='off'
          />
          <TextField
            label="Tempo Estimado"
            value={formData.tempoEstimado}
            onChange={handleChange('tempoEstimado')}
            autoComplete='off'
          />
          <TextField
            label="Passos (Steps)"
            value={formData.steps}
            onChange={handleChange('steps')}
            multiline
            rows={3}
            autoComplete='off'
          />
          <TextField
            label="Resultado Esperado"
            value={formData.resultadoEsperado}
            onChange={handleChange('resultadoEsperado')}
            multiline
            rows={3}
            autoComplete='off'
          />
          <TextField
            label="Vincular Requisito/Task"
            value={formData.requisitoVinculado}
            onChange={handleChange('requisitoVinculado')}
            autoComplete='off'
          />
          
          <ScriptUpload
            onFileSelect={(files) => {
              const selectedFiles = Array.from(files).map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                file: file,
              }));
              setFormData((prev) => ({
                ...prev,
                scripts: [...prev.scripts, ...selectedFiles],
              }));
            }}
          />
          
          {formData.scripts?.length > 0 && (
              <ul className='script-list'>
                {formData.scripts.map((script: ScriptFile, index: number) => (
                  <li key={index}>
                      <div>
                        <DocIcon></DocIcon>
                        {String(script)}
                      </div>
                    <GridDownloadIcon />
                  </li>
                ))}
              </ul>
            )}
          <Box className='button-group'>
            <Button onClick={() => navigate("/test-cases")} className='btn icon secondary'>
              Voltar
            </Button>
            <Button type="submit" className='btn icon primary'>
              Salvar
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageLayout>
  );
}
