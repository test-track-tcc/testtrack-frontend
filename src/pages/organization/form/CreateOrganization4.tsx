import React from 'react';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { TextField, ButtonGroup, Button, FormControlLabel, Checkbox, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

export default function CreateOrganization4() {
    const [selectedRole, setSelectedRole] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedRole(event.target.value);
    };

    return (
        <div>
            <SimpleHeader></SimpleHeader>
            <main>
                <CenteredSection>
                    <div className='organization-section'>
                        <div className="organization-title">
                            <h1>Nome da Organização</h1>
                        </div>

                        <h2>Quem está na sua organização?</h2>

                        <div className="input-container">
                            <TextField datatype='string' label='Adicione o e-mail do usuário' placeholder='Organização' style={{ minWidth: 300 }} />

                            <Select
                                label="Função"
                                value={selectedRole}
                                onChange={handleChange}
                                style={{ minWidth: 120 }}
                            >
                                <MenuItem value="">
                                    <em>Nenhum</em>
                                </MenuItem>
                                <MenuItem value={10}>Administrador</MenuItem>
                                <MenuItem value={20}>Membro</MenuItem>
                                <MenuItem value={30}>Desenvolvedor</MenuItem>
                            </Select>
                        </div>

                        <Button variant="outlined" startIcon={<AddIcon />} style={{ maxWidth: 160 }}>Adicionar outro</Button>

                        <ButtonGroup variant="contained" className='group-btn buttons-section'>
                            <Button variant="outlined" startIcon={<NotificationsIcon />}>Lembre-me mais tarde</Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />}>Próximo</Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    )
}

