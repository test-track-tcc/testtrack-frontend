import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from "../../../components/layout/SimpleHeader";
import CenteredSection from "../../../components/layout/CenteredSection";
import { TextField, ButtonGroup, Button, InputLabel, Box, FormControl, IconButton, CircularProgress, Alert, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { UsersService } from '../../../services/UsersService';
import { OrganizationService } from '../../../services/OrganizationService';
import { type User } from '../../../types/User';

type OrganizationRole = 'ADMIN' | 'MEMBER' | 'DEVELOPER';

interface Member {
    id: string;
    email: string;
    role: OrganizationRole;
}

export default function CreateOrganization4() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    // Define um cargo padrão para evitar erros
    const [newMemberRole, setNewMemberRole] = useState<OrganizationRole>('MEMBER');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        setMembers(savedData.members || []);
    }, []);

    const handleSearchUser = async () => {
        if (!newMemberEmail) {
            setError('Por favor, insira um e-mail.');
            return;
        }
        setIsLoading(true);
        setError('');
        setFoundUser(null);
        try {
            const user = await UsersService.getUserByEmail(newMemberEmail);
            if (user) {
                setFoundUser(user);
            } else {
                setError('Usuário não encontrado.');
            }
        } catch (err) {
            setError('Falha ao buscar usuário. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddMember = () => {
        if (foundUser && foundUser.id && foundUser.email && newMemberRole) {
            const memberExists = members.some(member => member.id === foundUser.id);
            if (memberExists) {
                setError('Este usuário já foi adicionado.');
                return;
            }
            setMembers([...members, { id: foundUser.id, email: foundUser.email, role: newMemberRole }]);
            setNewMemberEmail('');
            setNewMemberRole('MEMBER'); // Reseta para o padrão
            setFoundUser(null);
            setError('');
        }
    };

    const handleRemoveMember = (idToRemove: string) => {
        setMembers(members.filter(member => member.id !== idToRemove));
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const orgData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
            const organizationId = orgData.organizationId;

            if (!organizationId) {
                throw new Error("ID da organização não encontrado. Por favor, volte ao passo anterior.");
            }

            // AJUSTE: Mapeia os membros e agora envia o 'role' de cada um
            await Promise.all(
                members.map(member => 
                    OrganizationService.addUserToOrganization({
                        userId: member.id,
                        organizationId: organizationId,
                        role: member.role // <-- Enviando o cargo
                    })
                )
            );

            setSuccess('Membros adicionados com sucesso! Redirecionando...');
            localStorage.removeItem('onboardingData'); // Limpa o localStorage
            
            setTimeout(() => {
                navigate(`/organization/${organizationId}/projects`);
            }, 2000);

        } catch (err) {
            console.error("Falha ao adicionar membros:", err);
            setError("Ocorreu um erro ao adicionar os membros. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // NOVA FUNÇÃO: Limpa o storage e navega
    const handleLater = () => {
        localStorage.removeItem('onboardingData');
        navigate('/dashboard'); // Navega para a dashboard principal
    };

    return (
        <div>
            <title>Adicionar Membros | TestTrack</title>
            <SimpleHeader/>
            <main>
                <CenteredSection>
                    <div className='organization-section'>
                        <div className="organization-title">
                            <h1>{JSON.parse(localStorage.getItem('onboardingData') || '{}').orgName || 'Organização'}</h1>
                        </div>
                        <h2>Quem está na sua organização?</h2>
                        
                        {members.map((member) => (
                            <Box key={member.id} className="input-container" sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                <TextField
                                    label='E-mail do usuário'
                                    style={{ minWidth: 300 }}
                                    value={member.email}
                                    disabled // Desabilitado para não permitir edição
                                />
                                <TextField
                                    label="Função"
                                    value={member.role}
                                    style={{ minWidth: 150 }}
                                    disabled // Desabilitado para não permitir edição
                                />
                                <IconButton onClick={() => handleRemoveMember(member.id)} color="error" className='delete-button' disabled={isSubmitting}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                            <TextField
                                label='Adicione o e-mail do usuário'
                                placeholder='ex: johndoe@testrack.com.br'
                                style={{ minWidth: 300 }}
                                autoComplete='off'
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <Button variant="outlined" onClick={handleSearchUser} disabled={isLoading || isSubmitting}>
                                {isLoading ? <CircularProgress size={24} /> : 'Buscar'}
                            </Button>
                        </Box>
                        
                        {error && <Alert severity="error" sx={{ mt: 2, width: 'fit-content' }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2, width: 'fit-content' }}>{success}</Alert>}

                        {foundUser && (
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                                <Typography><strong>Usuário encontrado:</strong> {foundUser.name}</Typography>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel>Função</InputLabel>
                                    <Select
                                        label="Função"
                                        value={newMemberRole}
                                        onChange={(e: SelectChangeEvent<OrganizationRole>) => setNewMemberRole(e.target.value as OrganizationRole)}
                                    >
                                        {/* AJUSTE: valores alinhados com o back-end (ADMIN, MEMBER, DEVELOPER) */}
                                        <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                                        <MenuItem value={"MEMBER"}>Membro</MenuItem>
                                        <MenuItem value={"DEVELOPER"}>Desenvolvedor</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button startIcon={<AddIcon />} onClick={handleAddMember} variant="contained" disabled={isSubmitting}>
                                    Adicionar
                                </Button>
                            </Box>
                        )}

                        <ButtonGroup variant="contained" className='group-btn buttons-section' sx={{ mt: 4 }}>
                            {/* AJUSTE: onClick agora chama a função handleLater para limpar o storage */}
                            <Button variant="outlined" startIcon={<NotificationsIcon />} onClick={handleLater} disabled={isSubmitting}>
                                Lembre-me mais tarde
                            </Button>
                            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleFinish} disabled={isSubmitting}>
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finalizar e Adicionar'}
                            </Button>
                        </ButtonGroup>
                    </div>
                </CenteredSection>
            </main>
        </div>
    );
}