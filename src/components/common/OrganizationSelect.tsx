import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function OrganizationSelect() {
    const navigate = useNavigate();
    return (
        <div className="project-organization-select">
            <div className="project-organization-infos">
                <label htmlFor="">Organization Name</label>
                <p>Description about my organization</p>
            </div>

            <div>
                <Button className="primary-button" variant="contained" onClick={() => navigate("/projects")}>Entrar</Button>
            </div>
        </div>
    )
}
