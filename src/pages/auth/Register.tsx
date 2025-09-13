import React from "react";
import SimpleHeader from "../../components/layout/SimpleHeader";
import { TextField, Button, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegisterFunctions } from "../../functions/RegisterFunctions";
import "../../i18n";
import { type UserRegister } from "../../types/User";

function Register() {
  const navigate = useNavigate();
  const { handleSubmit } = useRegisterFunctions();

  const [formData, setFormData] = React.useState<UserRegister>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    try {
      await handleSubmit(formData);
      navigate("/");
    } catch {
      alert("Erro ao registrar. Verifique os dados.");
    }
  };

  return (
    <div>
      <title>Registrar-se | TestTrack</title>
      <SimpleHeader />
      <section className="center-container login-container">
        <div className="login-box">
          <h1 className="register">Crie sua conta!</h1>
          <p>
            Crie sua conta e comece a gerenciar seus testes automatizados com
            mais eficiência
          </p>
          <FormControl required>
            <TextField
              name="name"
              label="Nome"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="E-mail"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="password"
              label="Senha"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              name="confirmPassword"
              label="Confirme sua senha"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              className="primary-button"
              variant="contained"
              onClick={onSubmit}
            >
              Começar agora
            </Button>
          </FormControl>
          <p>
            Já possui sua conta no <strong>TestTrack</strong>?{" "}
            <a href="/">Clique aqui</a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
