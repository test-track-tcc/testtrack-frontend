// import React from 'react';
import SimpleHeader from "../components//SimpleHeader";
import { FormControl } from '@mui/base/FormControl';
import { TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';


function Login() {
  const { t } = useTranslation();

  return (
    <div>
      <SimpleHeader></SimpleHeader>
      <section className='center-container login-container'>
        <div className='login-box'>
          <h1>{t('login.welcome')}</h1>
          <FormControl defaultValue="" required>
            <TextField id="outlined-basic" label={t('login.welcome')} variant="outlined" />
            <TextField id="outlined-password-input" label="Senha" type="password" autoComplete="current-password"/>
            <Button className="primary-button" variant="contained">Entrar</Button>
          </FormControl>
          <p>Não possui uma conta? <a href="/register">Clique aqui</a></p>
        </div>
      </section>
    </div>
  )
}

export default Login
