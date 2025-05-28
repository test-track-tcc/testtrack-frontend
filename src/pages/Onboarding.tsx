// import React from 'react';
import SimpleHeader from "../components/SimpleHeader";
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import { Button } from '@mui/material';

function Onboarding() {
  return (
    <div>
      <SimpleHeader></SimpleHeader>
      <section className='center-container'>
        <div>
            <h1 className="head">Qual é seu tipo de perfil?</h1>
            <section className="onboarding-container">
              <div className="onboarding-box">
                <ManageAccountsOutlinedIcon/>
                <div className="onboarding-text">
                  <h2>Administrador</h2>
                  <h3>Ideal para líderes técnicos, gestores de qualidade ou coordenadores de equipes de QA</h3>
                  <p>Responsável por configurar e gerenciar a estrutura da organização no sistema.</p>
                </div>
                <Button className="primary-button" variant="contained">Escolher perfil</Button>
              </div>
              <div className="onboarding-box">
                <Groups2OutlinedIcon/>
                <div className="onboarding-text">
                  <h2>Membro de organização</h2>
                  <h3>Ideal para <strong>líderes</strong> técnicos, gestores de qualidade ou coordenadores de equipes de QA</h3>
                  <p>Responsável por configurar e gerenciar a estrutura da organização no sistema.</p>
                </div>
                <Button className="primary-button" variant="contained">Escolher perfil</Button>
              </div>
              <div className="onboarding-box">
                <PsychologyAltOutlinedIcon/>
                <div className="onboarding-text">
                  <h2>Desenvolvedor</h2>
                  <h3>Ideal para desenvolvedores de software responsáveis pela correção de erros apontados pelos testes automatizados</h3>
                  <p>Focado em corrigir falhas identificadas durante a execução dos testes</p>
                </div>
                <Button className="primary-button" variant="contained">Escolher perfil</Button>
              </div>
            </section>
        </div>
      </section>
    </div>
  )
}

export default Onboarding
