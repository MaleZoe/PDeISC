# Sonda — banco de pruebas de hardware (Expo SDK 58)

App de la consigna RN2: cámara, lector de códigos, GPS, acelerómetro/giroscopio y biometría. Interfaz de cuaderno de campo, lista para generar un `.apk` con EAS.

## Qué cubre

| Instrumento | Módulo |
| --- | --- |
| Cámara (foto, frontal/trasera, linterna) | `expo-camera` |
| Lector QR / barras | `expo-camera` (`onBarcodeScanned`) |
| Ubicación, precisión, altitud, dirección | `expo-location` |
| Acelerómetro y giroscopio | `expo-sensors` |
| Huella / Face ID | `expo-local-authentication` |

## Probar en desarrollo

```bash
npx expo start
```

Estas APIs nativas hay que probarlas **en un teléfono físico**. Expo Go cubre los módulos de este proyecto en SDK 58; cámara, GPS y biometría no se validan bien en el simulador.

## Generar el APK (EAS)

El perfil `preview` en `eas.json` ya produce un `.apk` de distribución interna.

1. Instalar la CLI (o usar `npx` en cada comando):

```bash
npm install -g eas-cli
eas login
eas whoami
```

2. Desde esta carpeta (`4_RN/RN2`), lanzar el build:

```bash
npx eas-cli@latest build -p android --profile preview
```

La primera vez EAS pide un keystore: elegí **Generate new keystore**.

3. Cuando termine, Expo muestra un enlace y un QR. En el teléfono Android:

- Permití instalar apps de orígenes desconocidos si lo pide.
- Descargá e instalá el APK.

También podés listar builds con `npx eas-cli@latest build:list` e instalar en emulador con `npx eas-cli@latest build:run -p android --latest`.

No uses el perfil `production` para esta entrega: genera `.aab` (Play Store), no un APK instalable a mano.
