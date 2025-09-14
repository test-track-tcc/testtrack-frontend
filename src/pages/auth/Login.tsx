import SimpleHeader from "../../components/layout/SimpleHeader";
import { TextField, Button, Alert, CircularProgress, Box, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { useAuth } from '../../functions/AuthFunctions';

function Login() {
  const { t } = useTranslation();
  const { credentials, loading, error, handleChange, handleLogin } = useAuth();

  return (
    <div>
      <title>Logar-se | TestTrack</title>
      <SimpleHeader />
      <section className='center-container login-container'>
        <div className='login-box'>
          <h1>{t('login.welcome')}</h1>
          <Box className="login-form" component="form" onSubmit={handleLogin}>
            <FormControl required>
              <TextField
                id="email-input"
                name="email"
                label={t('login.email')}
                variant="outlined"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
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
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
          <p>Não possui uma conta? <a href="/register">Clique aqui</a></p>
        </div>
      </section>
    </div>
  );
}

export default Login;