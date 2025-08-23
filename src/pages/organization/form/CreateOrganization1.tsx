import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { ToggleButton, ToggleButtonGroup, ButtonGroup, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization1() {
    const navigate = useNavigate();
    const [teamSize, setTeamSize] = useState<string | null>(null);
    const [companySize, setCompanySize] = useState<string | null>(null);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        setTeamSize(savedData.teamSize || null);
        setCompanySize(savedData.companySize || null);
    }, []);

    const handleTeamSizeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setTeamSize(newValue);
        }
    };

    const handleCompanySizeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setCompanySize(newValue);
        }
    };

    const handleNext = () => {
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...onboardingData,
            teamSize,
            companySize,
        }));
        navigate('/create-organization/step-2');
    };

    return (
        <div>
            <title>Criar Organização | TestTrack</title>
            <SimpleHeader></SimpleHeader>
            <main>
                <CenteredSection>
                    <div className='organization-section'>
                        <div className="organization-title">
                            <h1>Criar Organização</h1>
                            <p>Seja muito bem-vindo à criação da sua organização!</p>
                        </div>

                        <div className="select-option">
                            <h2>Quantas pessoas há na sua equipe atualmente?</h2>
                            <ToggleButtonGroup
                                value={teamSize}
                                exclusive
                                onChange={handleTeamSizeChange}
                                aria-label="employee count"
                                className="toggle-button-select"
                            >
                                <ToggleButton value="single">Apenas eu</ToggleButton>
                                <ToggleButton value="1-10">1-10</ToggleButton>
                                <ToggleButton value="11-50">11-50</ToggleButton>
                                <ToggleButton value="51-100">51-100</ToggleButton>
                                <ToggleButton value="100-500">100-500</ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        <div className="select-option">
                            <h2>Quantas pessoas trabalham na sua empresa?</h2>
                            <ToggleButtonGroup
                                value={companySize}
                                exclusive
                                onChange={handleCompanySizeChange}
                                aria-label="employee count"
                                className="toggle-button-select"
                            >
                                <ToggleButton value="1-20">1-20</ToggleButton>
                                <ToggleButton value="21-50">21-50</ToggleButton>
                                <ToggleButton value="51-100">51-100</ToggleButton>
                                <ToggleButton value="101-500">101-500</ToggleButton>
                                <ToggleButton value="500-1000">500-1000</ToggleButton>
                                <ToggleButton value="1000+">+1000</ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        <ButtonGroup variant="contained" className='group-btn buttons-section'>
                            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/onboarding')}>Voltar</Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>Próximo</Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    );
}