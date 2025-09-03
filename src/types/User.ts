export interface User {
    id?: string | undefined;
    name?: string;
    email?: string;  
}

export interface UserRegister {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface UserLoginData {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  access_token: string;
  firstAccess: boolean;
}
