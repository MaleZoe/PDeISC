# RN2 - Multi-Tools Hardware Hub (React Native + Expo)

Aplicación desarrollada con **React Native** y **Expo SDK 58** para interactuar con las capacidades de hardware de dispositivos móviles:

- 📷 **Cámara**: Vista previa, selector de cámara frontal/trasera y captura de fotografías.
- 🔎 **Lector de Códigos**: Escaneo en tiempo real de códigos QR y códigos de barras (EAN-13, EAN-8, Code 128, etc.).
- 📍 **Ubicación y GPS**: Coordenadas geográficas (latitud, longitud), margen de precisión, altitud y geocodificación inversa con dirección estimada.
- 📐 **Acelerómetro y Giroscopio**: Monitoreo dinámico de aceleración en 3 ejes (X, Y, Z) y velocidad angular.
- 🔐 **Biometría**: Autenticación nativa por huella dactilar o reconocimiento facial (Face ID / BiometricPrompt).

---

## 🚀 Probar Localmente

1. Iniciar el servidor de desarrollo:
```bash
npx expo start
```
2. Escanear el código QR con la app **Expo Go** en Android o usar un build de desarrollo.

---

## 📦 Generar APK con Expo EAS

El archivo [`eas.json`](./eas.json) ya está configurado con el perfil `preview` para compilar directamente un archivo **`.apk`**:

1. **Iniciar sesión en Expo** (si aún no lo hiciste):
```bash
npx eas-cli login
```

2. **Vincular el proyecto a EAS**:
```bash
npx eas-cli project:init
```

3. **Lanzar la compilación del APK en la nube**:
```bash
npx eas-cli build -p android --profile preview
```

> EAS compilará el instalador `.apk` de manera remota y al finalizar te brindará un enlace directo y un código QR para descargarlo e instalarlo inmediatamente en tu dispositivo Android.
