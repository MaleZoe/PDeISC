// src/types/user.ts

export interface User {
  id: number;
  usuario: string;
  email: string;
  nombre: string;
  rol: string;
  avatarUrl?: string;
  ultimoAcceso?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ValidationErrors {
  usuario?: string;
  password?: string;
}
