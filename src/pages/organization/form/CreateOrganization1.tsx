import React from 'react';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { ToggleButton, ToggleButtonGroup, ButtonGroup, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization1() {
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
                            <p>Seja muito bem-vindo à criação da sua organização!</p>
                        </div>

                        <h2>Quantas pessoas há na sua equipe atualmente?</h2>
                        <ToggleButtonGroup
                            value={value}
                            exclusive
                            onChange={handleChange}
                            aria-label="employee count"
                        >
                            <ToggleButton value="single">Apenas eu</ToggleButton>
                            <ToggleButton value="1-10">1-10</ToggleButton>
                            <ToggleButton value="11-50">11-50</ToggleButton>
                            <ToggleButton value="51-100">51-100</ToggleButton>
                            <ToggleButton value="100-500">100-500</ToggleButton>
                        </ToggleButtonGroup>

                        <h2>Quantas pessoas trabalham na sua empresa?</h2>
                        <ToggleButtonGroup
                            value={value}
                            exclusive
                            onChange={handleChange}
                            aria-label="employee count"
                        >
                            <ToggleButton value="1-20">1-20</ToggleButton>
                            <ToggleButton value="21-50">21-50</ToggleButton>
                            <ToggleButton value="51-100">51-100</ToggleButton>
                            <ToggleButton value="101-500">101-500</ToggleButton>
                            <ToggleButton value="500-1000">500-1000</ToggleButton>
                            <ToggleButton value="1000+">+1000</ToggleButton>
                        </ToggleButtonGroup>

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

