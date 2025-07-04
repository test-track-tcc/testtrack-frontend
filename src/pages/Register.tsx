import SimpleHeader from "../components//SimpleHeader";
import { FormControl } from '@mui/base/FormControl';
import { TextField, Button } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../i18n';


function Register () {
    const navigate = useNavigate();

    return(
        <div>
            <title>TestTrack | Registrar-se</title>
            <SimpleHeader></SimpleHeader>
            <section className='center-container login-container'>
                <div className='login-box'>
                    <h1 className="register">Crie sua conta!</h1>
                    <p>Crie sua conta e comece a gerenciar seus testes automatizados com mais eficiência</p>
                    <FormControl defaultValue="" required>
                        <TextField id="outlined-basic" label="Nome" variant="outlined" value={"John Doe"} />
                        <TextField id="outlined-basic" label="E-mail" variant="outlined" value={"johndoe@email.com"} />
                        <TextField id="outlined-password-input" label="Senha" type="password" autoComplete="current-password" value={"senha1234"}/>
                        <TextField id="outlined-password-input" label="Confirme sua senha" type="password" autoComplete="current-password" value={"senha1234"}/>
                        <Button className="primary-button" variant="contained" onClick={() => navigate("/")}>Começar agora</Button>
                    </FormControl>
                    <p>Já possui sua conta no <strong>TestTrack</strong>? <a href="/">Clique aqui</a></p>
                </div>
            </section>
        </div>
    )
}

export default Register
