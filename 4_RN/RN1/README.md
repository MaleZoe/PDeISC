# Acceso de Usuarios - React Native Expo & TypeScript (RN1)

Sistema completo de autenticación de usuarios desarrollado en **React Native (Expo + TypeScript)** con Backend en **Node.js Express** y **PHP (XAMPP/WAMP)** respaldado por una base de datos **MySQL**.

---

## 📋 Requisitos Cumplidos

1. **Página Principal (Login)**: Formulario de ingreso con campos para usuario/email y contraseña, validaciones visuales y cambio de visibilidad de contraseña.
2. **Paginación & Props**: Al validar las credenciales contra la API, la aplicación cambia a la **Página de Bienvenida** (`WelcomeScreen`) pasando todos los datos del usuario mediante **Props** de TypeScript (`user: User`).
3. **API Backend JSON & MySQL**:
   - **Base de Datos MySQL**: Archivo `schema.sql` listo para importar en MySQL/XAMPP.
   - **API Node.js Express**: Ubicada en `backend/server.js` (puerto 3000).
   - **API PHP**: Ubicada en `backend/login.php` (para XAMPP / Apache).
   - Devuelve las respuestas en formato JSON (`{ success: true/false, message: "...", user: {...} }`).

---

## 🚀 Guía de Ejecución

### 1. Configuración de la Base de Datos (MySQL / XAMPP)
1. Inicia **Apache** y **MySQL** en XAMPP/WAMP.
2. Abre phpMyAdmin en `http://localhost/phpmyadmin`.
3. Importa el archivo `backend/schema.sql` o ejecuta su contenido.
   - Crea la base de datos `sistema_login`.
   - Crea la tabla `usuarios`.
   - Inserta usuarios de prueba:
     - **Usuario:** `admin` | **Contraseña:** `admin123`
     - **Usuario:** `maria` | **Contraseña:** `123456`

---

### 2. Ejecutar el Backend

#### Opción A: Servidor Node.js Express (Recomendado)
```bash
cd backend
npm start
```
El servidor escuchará en `http://localhost:3000/api/login`.
*Nota: Si MySQL no está encendido, el servidor Node.js activará automáticamente un modo Demo para poder probar la aplicación sin interrupciones.*

#### Opción B: Servidor PHP (XAMPP / WAMP)
1. Copia o mueve la carpeta `backend` dentro del directorio `htdocs` de XAMPP (ej. `C:\xampp\htdocs\backend`).
2. La API estará accesible en `http://localhost/backend/login.php`.

---

### 3. Ejecutar la Aplicación React Native Expo
En la raíz del proyecto (`RN1`):

```bash
npm start
```

O para iniciar directamente en la Web o Emulador:
```bash
npm run web
```

---

## 📁 Estructura del Proyecto

```
RN1/
├── App.tsx                        # Componente principal que gestiona el estado de paginación
├── src/
│   ├── components/
│   │   ├── LoginScreen.tsx        # Formulario de inicio de sesión con selector de API
│   │   └── WelcomeScreen.tsx      # Pantalla de bienvenida que recibe el 'user' por PROPS
│   ├── config/
│   │   └── api.ts                 # Configuración de URLs de API
│   └── types/
│       └── user.ts                # Interfaces de TypeScript (User, LoginResponse)
├── backend/
│   ├── schema.sql                 # Script SQL de la base de datos MySQL
│   ├── server.js                  # API Backend en Node.js + Express
│   ├── login.php                  # API Backend en PHP para XAMPP/WAMP
│   └── package.json               # Dependencias del Backend Node.js
└── package.json                   # Dependencias de React Native / Expo
```
