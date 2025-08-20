import React from 'react';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { ToggleButton, ToggleButtonGroup, ButtonGroup, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization2() {
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

                        <div className="select-option">
                            <h2>Qual é o principal objetivo ou foco desta organização na ferramenta?</h2>
                            <ToggleButtonGroup
                                value={value}
                                exclusive
                                onChange={handleChange}
                                aria-label="employee count"
                                className="toggle-button-select"
                            >
                                <ToggleButton value="single">Gerenciar testes de produto</ToggleButton>
                                <ToggleButton value="1-10">Gerenciar testes no departamento de TI</ToggleButton>
                                <ToggleButton value="11-50">Gerenciar testes de integração contínua (CI/CD)</ToggleButton>
                                <ToggleButton value="51-100">Gerenciar testes de aceitação do usuário (UAT)</ToggleButton>
                            </ToggleButtonGroup>
                        </div>

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

