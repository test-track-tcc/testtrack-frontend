import CenteredSection from "../../components/layout/CenteredSection"
import SimpleHeader from "../../components/layout/SimpleHeader"
import OrganizationSelect from '../../components/common/OrganizationSelect';

export default function SelectOrganization() {

  return (
    <div>
        <SimpleHeader></SimpleHeader>
        <main>
            <CenteredSection>
                <div className="organization-section">
                  <div className="organization-title">
                    <h1>Selecione a organização</h1>
                    <p>Selecione a sua organização!</p>
                    
                    <OrganizationSelect />
                  </div>
                </div>
            </CenteredSection>
        </main>
    </div>
  )
}

