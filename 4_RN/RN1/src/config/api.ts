// src/config/api.ts
import { Platform } from 'react-native';

export const getApiHost = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }
  return '10.0.15.12';
};

export const API_ENDPOINTS = {
  // Servidor Node.js (Express en puerto 3000)
  get NODE_LOCAL(): string {
    return `http://${getApiHost()}:3000/api/login`;
  },
  get NODE_REGISTER(): string {
    return `http://${getApiHost()}:3000/api/register`;
  },
  get NODE_FORGOT_PASSWORD(): string {
    return `http://${getApiHost()}:3000/api/forgot-password`;
  },
  get NODE_RESET_PASSWORD(): string {
    return `http://${getApiHost()}:3000/api/reset-password`;
  },

  // Servidor PHP (XAMPP / WAMP)
  get PHP_XAMPP(): string {
    return `http://${getApiHost()}/backend/login.php`;
  },

  // Android Emulator
  ANDROID_EMULATOR_NODE: 'http://10.0.2.2:3000/api/login',
  ANDROID_EMULATOR_PHP: 'http://10.0.2.2/backend/login.php',
};

export const DEFAULT_API_URL = `http://${getApiHost()}:3000/api/login`;

// Helper para obtener URLs dinámicas basadas en la selección de backend
export function getApiUrl(baseUrl: string, endpoint: string): string {
  if (baseUrl.includes('/login.php')) {
    return baseUrl; // PHP endpoint único
  }
  const rootUrl = baseUrl.replace(/\/login$/, '');
  return `${rootUrl}${endpoint}`;
}

