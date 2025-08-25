import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection"
import { TextField, ButtonGroup, Button, InputLabel, Box, FormControl } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

interface Member {
    email: string;
    role: string;
}

export default function CreateOrganization4() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [newMember, setNewMember] = useState<Member>({ email: '', role: '' });

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        setMembers(savedData.members || []);
    }, []);

    const handleRoleChange = (event: SelectChangeEvent) => {
        setNewMember({ ...newMember, role: event.target.value });
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMember({ ...newMember, email: event.target.value });
    };

    const handleAddMember = () => {
        if (newMember.email && newMember.role) {
            setMembers([...members, newMember]);
            setNewMember({ email: '', role: '' });
        }
    };

    const handleFinish = () => {
        const finalData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({
            ...finalData,
            members,
        }));
        
        console.log('Dados finais a serem enviados:', JSON.parse(localStorage.getItem('onboardingData') || '{}'));
        localStorage.removeItem('onboardingData');
        
        navigate('/projects');
    };

    return (
        <div>
            <title>Criar Organização | TestTrack</title>
            <SimpleHeader></SimpleHeader>
            <main>
                <CenteredSection>
                    <div className='organization-section'>
                        <div className="organization-title">
                            <h1>{JSON.parse(localStorage.getItem('onboardingData') || '').orgName || 'Organização'}</h1>
                        </div>

                        <h2>Quem está na sua organização?</h2>

                        {members.map((member, index) => (
                            <Box key={index} className="input-container" sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <TextField
                                    datatype='string'
                                    label='E-mail do usuário'
                                    style={{ minWidth: 300 }}
                                    value={member.email}
                                    disabled
                                />
                                <FormControl sx={{ minWidth: 120 }}>
                                    <InputLabel>Função</InputLabel>
                                    <Select
                                        label="Função"
                                        value={member.role}
                                        disabled
                                    >
                                        <MenuItem value={"Administrador"}>Administrador</MenuItem>
                                        <MenuItem value={"Membro"}>Membro</MenuItem>
                                        <MenuItem value={"Desenvolvedor"}>Desenvolvedor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        ))}
                        
                        <Box className="input-container" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                datatype='string'
                                label='Adicione o e-mail do usuário'
                                placeholder='ex: johndoe@testrack.com.br'
                                style={{ minWidth: 300 }}
                                value={newMember.email}
                                onChange={handleEmailChange}
                            />
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Função</InputLabel>
                                <Select
                                    label="Função"
                                    value={newMember.role}
                                    onChange={handleRoleChange}
                                >
                                    <MenuItem value="">
                                        <em>Nenhum</em>
                                    </MenuItem>
                                    <MenuItem value={"Administrador"}>Administrador</MenuItem>
                                    <MenuItem value={"Membro"}>Membro</MenuItem>
                                    <MenuItem value={"Desenvolvedor"}>Desenvolvedor</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Button 
                            variant="outlined" 
                            startIcon={<AddIcon />} 
                            style={{ maxWidth: 160 }} 
                            onClick={handleAddMember}
                        >
                            Adicionar outro
                        </Button>

                        <ButtonGroup variant="contained" className='group-btn buttons-section'>
                            <Button variant="outlined" startIcon={<NotificationsIcon />} onClick={handleFinish}>Lembre-me mais tarde</Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleFinish}>Finalizar</Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    );
}