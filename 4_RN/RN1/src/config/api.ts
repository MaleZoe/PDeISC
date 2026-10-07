// src/config/api.ts

export const API_ENDPOINTS = {
  // Servidor Node.js (Express en puerto 3000)
  NODE_LOCAL: 'http://localhost:3000/api/login',
  NODE_REGISTER: 'http://localhost:3000/api/register',
  NODE_FORGOT_PASSWORD: 'http://localhost:3000/api/forgot-password',
  NODE_RESET_PASSWORD: 'http://localhost:3000/api/reset-password',

  // Servidor PHP (XAMPP / WAMP)
  PHP_XAMPP: 'http://localhost/backend/login.php',

  // Android Emulator
  ANDROID_EMULATOR_NODE: 'http://10.0.2.2:3000/api/login',
  ANDROID_EMULATOR_PHP: 'http://10.0.2.2/backend/login.php',
};

export const DEFAULT_API_URL = API_ENDPOINTS.NODE_LOCAL;

// Helper para obtener URLs dinámicas basadas en la selección de backend
export function getApiUrl(baseUrl: string, endpoint: string): string {
  if (baseUrl.includes('/login.php')) {
    return baseUrl; // PHP endpoint único
  }
  const rootUrl = baseUrl.replace(/\/login$/, '');
  return `${rootUrl}${endpoint}`;
}
