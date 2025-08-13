import SimpleHeader from "../../components/layout/SimpleHeader";
import { FormControl } from '@mui/base/FormControl';
import { TextField, Button, Alert, CircularProgress, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { useAuth } from '../../functions/AuthFunctions';

function Login() {
  const { t } = useTranslation();
  // Use o hook para obter tudo o que você precisa
  const { credentials, loading, error, handleChange, handleLogin } = useAuth();

  return (
    <div>
      <title>Logar-se | TestTrack</title>
      <SimpleHeader />
      <section className='center-container login-container'>
        <div className='login-box'>
          <h1>{t('login.welcome')}</h1>
          {error && <Alert severity="error">{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin}>
            <FormControl required>
              <TextField
                id="email-input"
                name="email"
                label={t('login.email')}
                variant="outlined"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                id="password-input"
                name="password"
                label={t('login.password')}
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              <Button 
                className="primary-button" 
                variant="contained" 
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </FormControl>
          </Box>
          <p>Não possui uma conta? <a href="/register">Clique aqui</a></p>
        </div>
      </section>
    </div>
  );
}

export default Login;