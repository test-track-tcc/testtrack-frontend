import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { TextField, ButtonGroup, Button, FormControlLabel, Checkbox, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CreateOrganization3() {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        setOrgName(savedData.orgName || '');
        setOrgDescription(savedData.orgDescription || '');
        setIsAdmin(savedData.isAdmin || false);
    }, []);

    const handleBack = () => {
        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...onboardingData,
            orgName,
            orgDescription,
            isAdmin,
        }));
        navigate('/create-organization/step-2');
    };

    const handleNext = () => {
        if (!isAdmin) {
            setIsError(true);
            return;
        }

        const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...onboardingData,
            orgName,
            orgDescription,
            isAdmin,
        }));
        navigate('/create-organization/step-4');
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
                            <p>Está quase lá... Você está terminando de configurar a sua organização, falta pouco!</p>
                        </div>

                        <h2>Cadastrar Organização</h2>

                        <TextField
                            datatype='string'
                            label='Nome da Organização'
                            placeholder='ex: TestTrack Organization'
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                        />
                        
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição"
                            placeholder='ex: Estou descrevendo minha organização...'
                            multiline
                            rows={4}
                            value={orgDescription}
                            onChange={(e) => setOrgDescription(e.target.value)}
                        />

                        <FormControlLabel
                            required
                            control={<Checkbox checked={isAdmin} onChange={(e) => { setIsAdmin(e.target.checked); setIsError(false); }} />}
                            label="Você concorda que ao criar essa organização você se torna administrador principal da mesma?"
                        />

                        {isError && (
                            <Typography color="error" variant="body2">
                                Por favor, aceite os termos para continuar.
                            </Typography>
                        )}

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