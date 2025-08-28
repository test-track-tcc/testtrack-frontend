import PageLayout from "../../components/layout/PageLayout";
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function Projects() { 
    const navigate = useNavigate();

    return (
        <PageLayout>
            <title>Projetos | TestTrack</title>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <h1>Projetos</h1>
                <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/addProject')}
                startIcon={<AddIcon />}
                className="btn primary icon"
                >
                    Adicionar Projeto
                </Button>
            </Box>

            <Box className="projects-list">
                <Box className="project-item">
                    <img src="src\assets\img\mock-project.png" alt="" />
                    <h2>TestTrack</h2>
                    <p>O projeto TestTrack é um projeto de TCC.</p>
                    <Button className="btn icon primary" onClick={() => navigate('/testCase')}>Ver detalhes</Button>
                </Box>

            </Box>
        </PageLayout>
    )
}
