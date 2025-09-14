import { UsersService } from '../services/UsersService';
import { type UserRegister } from '../types/User';

export function useRegisterFunctions() {
  const handleSubmit = async (formData: UserRegister) => {
    try {
      const response = await UsersService.create(formData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return { handleSubmit };
}
