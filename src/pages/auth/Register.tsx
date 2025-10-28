import React, { useState } from "react";
import SimpleHeader from "../../components/layout/SimpleHeader";
// Importe Alert para exibir erros gerais
import { TextField, Button, FormControl, Alert } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import { useRegisterFunctions } from "../../functions/RegisterFunctions";
import "../../i18n";
import { type UserRegister } from "../../types/User";

// Define um tipo para as mensagens de erro
type ErrorMessages = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string; // Para erros gerais não específicos de um campo
};

function Register() {
  const navigate = useNavigate();
  const { handleSubmit } = useRegisterFunctions();

  const [formData, setFormData] = useState<UserRegister>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<ErrorMessages>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const onSubmit = async () => {
    setErrors({});
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem" });
      return;
    }
    try {
      await handleSubmit(formData);
      navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
        
        const backendErrors: string[] = error.response.data.message;
        const newErrors: ErrorMessages = {};
        let unmappedErrors: string[] = [];

        backendErrors.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();

          if (lowerMsg.includes("email")) {
            newErrors.email = msg;
          } else if (lowerMsg.includes("senha")) {
            newErrors.password = msg; 
          } else if (lowerMsg.includes("nome")) {
            newErrors.name = msg;
          } else {
            unmappedErrors.push(msg);
          }
        });

        if (unmappedErrors.length > 0) {
          newErrors.general = unmappedErrors.join("; ");
        }
        
        setErrors(newErrors);

      } else if (error.response && error.response.data && error.response.data.message) {
         setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Erro ao conectar com o servidor. Tente novamente." });
        console.error("Registration error:", error);
      }
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
          <FormControl className="login-form" required>
            <TextField
              name="name"
              label="Nome"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              // Adiciona props de erro
              error={!!errors.name}
              helperText={errors.name}
              required
              />
            <TextField
              name="email"
              label="E-mail"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              // Adiciona props de erro
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              name="password"
              label="Senha"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              // Adiciona props de erro
              error={!!errors.password}
              helperText={errors.password}
              required
              />
            <TextField
              name="confirmPassword"
              label="Confirme sua senha"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              // Adiciona props de erro
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
            <Button
              className="primary-button"
              variant="contained"
              onClick={onSubmit}
              >
              Começar agora
            </Button>
          </FormControl>
          {errors.general && <Alert severity="error" style={{ width: '100%', boxSizing: 'border-box' }}>{errors.general}</Alert>}
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