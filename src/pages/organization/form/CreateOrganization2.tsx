import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { ToggleButton, ToggleButtonGroup, ButtonGroup, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization2() {
    const navigate = useNavigate();
    const [mainGoal, setMainGoal] = useState<string | null>(null);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        setMainGoal(savedData.mainGoal || null);
    }, []);

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setMainGoal(newValue);
        }
    };

    const handleBack = () => {
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...onboardingData,
            mainGoal,
        }));
        navigate('/create-organization/step-1');
    };

    const handleNext = () => {
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...onboardingData,
            mainGoal,
        }));
        navigate('/create-organization/step-3');
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
                                value={mainGoal}
                                exclusive
                                onChange={handleChange}
                                aria-label="main goal"
                                className="toggle-button-select"
                            >
                                <ToggleButton value="gerenciar-testes-produto">Gerenciar testes de produto</ToggleButton>
                                <ToggleButton value="gerenciar-testes-ti">Gerenciar testes no departamento de TI</ToggleButton>
                                <ToggleButton value="gerenciar-testes-ci-cd">Gerenciar testes de integração contínua (CI/CD)</ToggleButton>
                                <ToggleButton value="gerenciar-testes-uat">Gerenciar testes de aceitação do usuário (UAT)</ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        <ButtonGroup variant="contained" className='group-btn buttons-section'>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>Voltar</Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>Próximo</Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    );
}