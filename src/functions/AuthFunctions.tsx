import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { type UserLoginData } from '../types/User';
import { removeItem } from '../utils/authStorage';

// 1. Definir o tipo para os erros de validação
type ValidationErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export function useAuth() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<UserLoginData>({
    email: '',
    password: '',
  });
  
  // 2. Mudar o estado de 'error' (string) para 'errors' (objeto)
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa os erros ao digitar
    setErrors(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrors(null); // Limpa erros anteriores

    try {
      const data = await AuthService.login(credentials);

      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('userData', JSON.stringify({ id: data.id, name: data.name, email: data.email, firstAccess: data.firstAccess}));

      if (data.firstAccess) {
        navigate('/onboarding');
      } else {
        navigate('/organization');
      }
    } catch (err: any) {
      // 3. Implementar a lógica de tratamento de erro do NestJS
      if (err.response && err.response.data) {
        const backendMessage = err.response.data.message;

        // Caso 1: Array de erros de validação (ex: 400 Bad Request)
        if (Array.isArray(backendMessage)) {
          const newErrors: ValidationErrors = {};
          backendMessage.forEach((msg: string) => {
            const lowerMsg = msg.toLowerCase();
            if (lowerMsg.includes("email")) {
              newErrors.email = msg;
            } else if (lowerMsg.includes("senha")) {
              newErrors.password = msg;
            } else {
              newErrors.general = (newErrors.general || "") + msg + " ";
            }
          });
          setErrors(newErrors);
        } 
        // Caso 2: Erro único (ex: 401 Unauthorized "Credenciais inválidas")
        else if (typeof backendMessage === 'string') {
          setErrors({ general: backendMessage });
        }
        // Caso 3: Outro formato de erro inesperado
        else {
           setErrors({ general: "E-mail ou senha inválidos." });
        }
      } else {
        // Erro de rede ou CORS
        setErrors({ general: "Erro ao conectar com o servidor. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
   try {
       navigate('/login');
       await AuthService.logout();
   } catch (error) {
     console.error("Error during backend logout:", error);
   } finally {
       removeItem('authToken');
       removeItem('userData');
   }
  };

  return {
    credentials,
    loading,
    errors, // 4. Retornar 'errors' (objeto) em vez de 'error' (string)
    handleChange,
    handleLogin,
    handleLogout
  };
}