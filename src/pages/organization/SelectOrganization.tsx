import { Button } from '@mui/material';
import CenteredSection from "../../components/layout/CenteredSection"
import SimpleHeader from "../../components/layout/SimpleHeader"
import { useNavigate } from 'react-router-dom';

export default function SelectOrganization() {
  const navigate = useNavigate();

  return (
    <div>
        <SimpleHeader></SimpleHeader>
        <main>
            <CenteredSection>
                <div className="organization-section">
                  <div className="organization-title">
                    <h1>Selecione a organização</h1>
                    <p>Selecione a sua organização!</p>
                  </div>

                  <div className='project-organization-general'>
                    <div className="project-organization-select">
                      <div className="project-organization-infos">
                        <label htmlFor="">Organization Name</label>
                        <p>Description about my organization</p>
                      </div>

                      <div>
                          <Button className="primary-button" variant="contained" onClick={() => navigate("/projects")}>Entrar</Button>
                      </div>
                    </div>
                  </div>
                </div>
            </CenteredSection>
        </main>
    </div>
  )
}

