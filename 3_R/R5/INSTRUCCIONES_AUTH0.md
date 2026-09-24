# Configuración de OAuth 2.0 (Google, Meta, GitHub, etc.) usando Auth0

Se ha integrado el login mediante redes sociales en tu aplicación BiblioTech utilizando **Auth0**, ya que Auth0 permite habilitar múltiples proveedores (Google, Meta, GitHub, Discord, Twitch, X/Twitter, etc.) desde un solo panel de control sin necesidad de programar integraciones individuales.

## Pasos para hacerlo funcionar:

### 1. Crear una cuenta en Auth0
1. Ingresa a [Auth0](https://auth0.com/es/) y regístrate o inicia sesión.
2. Crea un nuevo **Tenant** (Espacio de trabajo) si no tienes uno.
3. En el menú lateral, ve a **Applications > Applications** y haz clic en **Create Application**.
4. Selecciona **Single Page Web Applications** y ponle el nombre "BiblioTech".

### 2. Configurar la Aplicación en Auth0
Dentro de la configuración de tu nueva aplicación, busca la sección de **Application URIs**:
- **Allowed Callback URLs**: `http://localhost:5173` (o el puerto donde corra tu frontend)
- **Allowed Logout URLs**: `http://localhost:5173`
- **Allowed Web Origins**: `http://localhost:5173`
- **Allowed Origins (CORS)**: `http://localhost:5173`
Guarda los cambios al final de la página.

### 3. Configurar Conexiones Sociales
1. En el menú lateral de Auth0, ve a **Authentication > Social**.
2. Haz clic en **Create Connection**.
3. Elige los proveedores que necesites: Google, Facebook (Meta), GitHub, Discord, Twitch, etc. Auth0 te pedirá las credenciales de desarrollador de cada plataforma (las cuales puedes obtener siguiendo sus respectivas guías, aunque Auth0 tiene claves de prueba "Dev Keys" para probar rápidamente sin configurar nada extra).
4. Asegúrate de que las conexiones estén habilitadas para tu aplicación "BiblioTech".

### 4. Configurar las Variables de Entorno
1. En tu panel de Auth0, en la configuración de la aplicación, copia el **Domain** y el **Client ID**.
2. En la carpeta `frontend/`, crea un archivo llamado `.env` (o edita el existente) y añade estas dos variables:

```env
VITE_AUTH0_DOMAIN=tu-dominio-de-auth0.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu-client-id-alfanumerico
```

3. Reinicia tu servidor frontend (`npm run dev`).

### ¿Cómo funciona en el código?
- El frontend utiliza `@auth0/auth0-react` para manejar la redirección y el token social.
- En la base de datos local, cuando un usuario inicia sesión con una red social por primera vez, el backend crea un usuario y le asigna automáticamente el **Rol de Alumno (Rol 3)**, garantizando que el Control de Acceso Basado en Roles (RBAC) siga funcionando intacto.
- Al usuario se le asigna un JWT local compatible con todas las rutas y servicios actuales.
