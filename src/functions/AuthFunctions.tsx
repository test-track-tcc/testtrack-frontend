import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { type UserLoginData } from '../types/User';
import { removeItem } from '../utils/authStorage';

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
  
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrors(null);

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
      if (err.response && err.response.data) {
        const backendMessage = err.response.data.message;

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
        else if (typeof backendMessage === 'string') {
          setErrors({ general: backendMessage });
        }
        else {
           setErrors({ general: "E-mail ou senha inválidos." });
        }
      } else {
        setErrors({ general: "Erro ao conectar com o servidor. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
   try {
        removeItem('userData');
       navigate('/login');
       removeItem('authToken');
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
    errors,
    handleChange,
    handleLogin,
    handleLogout
  };
}