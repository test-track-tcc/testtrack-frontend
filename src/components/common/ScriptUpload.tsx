import React from 'react';
import { Button, Typography } from '@mui/material';

type ScriptUploadProps = {
  onFileSelect: (files: FileList) => void;
};

const ScriptUpload: React.FC<ScriptUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(event.target.files);
    }
  };

  return (
    <div>
      <Typography variant="subtitle1" gutterBottom>
        Upload de Scripts Automatizados
      </Typography>

      <Button variant="outlined" color="primary" onClick={handleButtonClick}>
        Selecionar Arquivo(s)
      </Button>

      <input
        type="file"
        accept=".js,.ts,.txt,.zip,.py"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ScriptUpload;
