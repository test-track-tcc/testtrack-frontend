import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';

interface ScriptDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function ScriptDropzone({ files, onFilesChange }: ScriptDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
    );
    onFilesChange([...files, ...newFiles]);
    setIsDragActive(false);
  };

  const handleRemoveFile = (fileName: string) => {
    onFilesChange(files.filter(file => file.name !== fileName));
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'transparent',
          border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`,
          transition: 'background-color 0.2s, border-color 0.2s',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <input {...getInputProps()} accept='.py, .js, .java, .feature, .robot, .spec.js, .sh, .yml e .yaml, .json, .zip' />
        <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1">
          Arraste e solte os scripts aqui, ou clique para selecionar
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Os arquivos serão enviados ao salvar o caso de teste.
        </Typography>
      </Paper>

      {files.length > 0 && (
        <List dense sx={{ mt: 2 }}>
          {files.map(file => (
            <ListItem
              key={`${file.name}-${file.lastModified}`}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(file.name)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}