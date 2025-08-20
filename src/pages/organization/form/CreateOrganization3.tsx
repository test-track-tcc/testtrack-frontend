import React from 'react';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { TextField, ButtonGroup, Button, FormControlLabel, Checkbox } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization3() {
    const [value, setValue] = React.useState<string | null>("");

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
        setValue(newValue);
        }
    };

    return (
        <div>
            <SimpleHeader></SimpleHeader>
            <main>
                <CenteredSection>
                    <div className='organization-section'>
                        <div className="organization-title">
                            <h1>Criar Organização</h1>
                            <p>Está quase lá... Você está terminando de configurar a sua organização, falta pouco!</p>
                        </div>

                        <h2>Cadastrar Organização</h2>

                        <TextField datatype='string' label='Nome da Organização' placeholder='Organização'></TextField>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição"
                            multiline
                            rows={4}
                        />

                        <FormControlLabel required control={<Checkbox />} label="Você concorda que ao criar essa organização você se torna administrador principal da mesma?" />

                        <ButtonGroup variant="contained" className='group-btn buttons-section'>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />}>Voltar</Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />}>Próximo</Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    )
}

