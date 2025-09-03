import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { type UserLoginData } from '../types/User';
import { removeItem } from '../utils/authStorage';

export function useAuth() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<UserLoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

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
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout(); 
    removeItem('authToken');
    removeItem('userData');
    navigate('/login');
  };

  return {
    credentials,
    loading,
    error,
    handleChange,
    handleLogin,
    handleLogout
  };
}
