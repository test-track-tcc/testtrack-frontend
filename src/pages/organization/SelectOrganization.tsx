import CenteredSection from "../../components/layout/CenteredSection"
import SimpleHeader from "../../components/layout/SimpleHeader"
import OrganizationSelect from '../../components/common/OrganizationSelect';
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

export default function SelectOrganization() {
  const navigate = useNavigate();
  return (
    <div>
        <title>Organizações | TestTrack</title>
        <SimpleHeader></SimpleHeader>
        <main>
            <CenteredSection>
                <div className="organization-section">
                  <div className="organization-title">
                    <div className="flex-row-between-items-center">
                      <h1>Selecione a organização</h1>
                      <Button className="btn primary icon" startIcon={<AddIcon />} onClick={() => navigate('/create-organization/step-1')}>Criar Organização</Button>
                    </div>
                    <div className="flex-row-between-items-center">
                      <p>Selecione a sua organização!</p>
                    </div>
                    
                    <OrganizationSelect />
                  </div>
                </div>
            </CenteredSection>
        </main>
    </div>
  )
}

