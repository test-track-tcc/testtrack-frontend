import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { TextField, ButtonGroup, Button, FormControlLabel, Checkbox, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { OrganizationService } from '../../../services/OrganizationService';
import axios from 'axios';

export default function CreateOrganization3() {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<String>('');
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

    const handleNext = async () => {
        if (!isAdmin) {
            setIsError(true);
            setError('Você precisa ser um administrador para continuar.');
            return;
        }

        const userDataString = localStorage.getItem('userData');
        const adminId = userDataString ? JSON.parse(userDataString).id : null;
        if (!adminId) {
            setIsError(true);
            setError('Não foi possível identificar o administrador. Faça login novamente.');
            return;
        }

        const payload = {
            name: orgName,
            description: orgDescription,
            adminId: adminId
        };

        try {
            const createdOrg = await OrganizationService.create(payload);

            if (!createdOrg || !createdOrg.id) {
                throw new Error("A API não retornou um ID para a organização.");
            }

            const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
            localStorage.setItem('onboardingData', JSON.stringify({
                ...onboardingData,
                orgName,
                orgDescription,
                isAdmin,
                organizationId: createdOrg.id, 
            }));
            navigate('/create-organization/step-4');

        } catch (error) {
            console.error("Falha ao criar organização:", error);
            setIsError(true);
            if (axios.isAxiosError(error)) {
                setError(String(error.response?.data?.message || 'Erro ao criar organização'));
            } else {
                setError('Ocorreu um erro inesperado.');
            }
        }
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
                                {error}
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