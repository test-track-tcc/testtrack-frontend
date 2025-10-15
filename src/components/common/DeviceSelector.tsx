import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, type SelectChangeEvent } from '@mui/material';

export type DeviceType = 'DESKTOP' | 'MOBILE' | 'TABLET' | 'OTHER';

interface DeviceSelectorProps {
  targetDevice: DeviceType | '';
  customTargetDevice: string;
  onDeviceChange: (device: DeviceType | '') => void;
  onCustomDeviceChange: (customDevice: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  targetDevice,
  customTargetDevice,
  onDeviceChange,
  onCustomDeviceChange,
}) => {
  const showCustom = targetDevice === 'OTHER';

  const handleDeviceChange = (event: SelectChangeEvent<DeviceType | ''>) => {
    const value = event.target.value as DeviceType | '';
    onDeviceChange(value);
  };

  return (
    <div>
      <FormControl fullWidth margin="none" sx={{marginBottom: '16px'}}>
        <InputLabel>Tipo de Dispositivo</InputLabel>
        <Select
          value={targetDevice}
          onChange={handleDeviceChange}
          label="Tipo de Dispositivo"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'DESKTOP'}>Desktop</MenuItem>
          <MenuItem value={'MOBILE'}>Mobile</MenuItem>
          <MenuItem value={'TABLET'}>Tablet</MenuItem>
          <MenuItem value={'OTHER'}>Other</MenuItem>
        </Select>
      </FormControl>
      {showCustom && (
        <TextField
          fullWidth
          margin="normal"
          label="Tipo de Dispositivo Customizado"
          value={customTargetDevice}
          onChange={(e) => onCustomDeviceChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default DeviceSelector;