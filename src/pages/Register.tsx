import SimpleHeader from "../components//SimpleHeader";
import { FormControl } from '@mui/base/FormControl';
import { TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';


function Register () {
    const { t } = useTranslation();
    
    return(
        <div>
            <SimpleHeader></SimpleHeader>
            <section className='center-container login-container'>
                <div className='login-box'>
                    <h1 className="register">Crie sua conta!</h1>
                    <p>Crie sua conta e comece a gerenciar seus testes automatizados com mais eficiência</p>
                    <FormControl defaultValue="" required>
                        <TextField id="outlined-basic" label="Nome" variant="outlined" />
                        <TextField id="outlined-basic" label="E-mail" variant="outlined" />
                        <TextField id="outlined-password-input" label="Senha" type="password" autoComplete="current-password"/>
                        <TextField id="outlined-password-input" label="Confirme sua senha" type="password" autoComplete="current-password"/>
                        <Button className="primary-button" variant="contained">Começar agora</Button>
                    </FormControl>
                    <p>Já possui sua conta no <strong>TestTrack</strong>? <a href="/">Clique aqui</a></p>
                </div>
            </section>
        </div>
    )
}

export default Register