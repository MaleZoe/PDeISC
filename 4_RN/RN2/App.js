import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'camera' | 'barcode' | 'location' | 'sensors' | 'biometrics'

  // Cámara
  const [cameraFacing, setCameraFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  // Escáner de Códigos
  const [scannedData, setScannedData] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  // Ubicación & GPS
  const [locationData, setLocationData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Sensores: Acelerómetro & Giroscopio
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [sensorsActive, setSensorsActive] = useState(false);

  // Biometría
  const [biometricTypes, setBiometricTypes] = useState([]);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('No verificado');

  // Hook Sensores
  useEffect(() => {
    let accelSub = null;
    let gyroSub = null;

    if (sensorsActive) {
      Accelerometer.setUpdateInterval(200);
      Gyroscope.setUpdateInterval(200);

      accelSub = Accelerometer.addListener((data) => {
        setAccelerometerData(data);
      });

      gyroSub = Gyroscope.addListener((data) => {
        setGyroscopeData(data);
      });
    }

    return () => {
      if (accelSub) accelSub.remove();
      if (gyroSub) gyroSub.remove();
    };
  }, [sensorsActive]);

  // Chequeo de Biometría al iniciar
  useEffect(() => {
    checkBiometricsSupport();
  }, []);

  const checkBiometricsSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setIsBiometricEnrolled(enrolled);
      setBiometricTypes(types);
    } catch (e) {
      console.log('Error al verificar biometría:', e);
    }
  };

  // --- ACCIONES CÁMARA ---
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhotoUri(photo.uri);
      } catch (err) {
        Alert.alert('Error', 'No se pudo capturar la foto.');
      }
    }
  };

  // --- ACCIONES UBICACIÓN ---
  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se concedió acceso a la ubicación.');
        setLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocationData(currentLocation.coords);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        setAddressData(reverseGeocode[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No fue posible obtener la ubicación GPS.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // --- ACCIONES ESCÁNER DE CÓDIGOS ---
  const handleBarCodeScanned = ({ type, data }) => {
    if (!scannerActive) return;
    setScannerActive(false);
    setScannedData({ type, data });
  };

  // --- ACCIONES BIOMETRÍA ---
  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación Biométrica / Huella / FaceID',
        fallbackLabel: 'Usar contraseña del dispositivo',
        cancelLabel: 'Cancelar',
      });

      if (result.success) {
        setBiometricStatus('Autenticación Exitosa');
        Alert.alert('Éxito', 'Identidad confirmada exitosamente con biometría.');
      } else {
        setBiometricStatus('Falló o fue cancelado');
      }
    } catch (error) {
      Alert.alert('Error', 'Error en la autenticación biométrica.');
    }
  };

  // --- RENDERIZADO DE VISTAS ---

  const renderHeader = (title) => (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          setActiveTab('menu');
          setSensorsActive(false);
        }}
      >
        <Text style={styles.backBtnText}>‹ Volver</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 60 }} />
    </View>
  );

  // VISTA MENÚ PRINCIPAL
  const renderMenu = () => (
    <ScrollView contentContainerStyle={styles.menuScroll}>
      <View style={styles.bannerContainer}>
        <Text style={styles.appTitle}>🛠️ Expo Hardware Hub</Text>
        <Text style={styles.appSubtitle}>
          Demostración y prueba interactiva de sensores, herramientas de hardware y biometría.
        </Text>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={[styles.card, { borderLeftColor: '#3B82F6' }]}
          onPress={async () => {
            if (!cameraPermission?.granted) {
              await requestCameraPermission();
            }
            setActiveTab('camera');
          }}
        >
          <Text style={styles.cardIcon}>📷</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Cámara</Text>
            <Text style={styles.cardDescription}>Captura de fotos con preview frontal/trasera.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderLeftColor: '#10B981' }]}
          onPress={async () => {
            if (!cameraPermission?.granted) {
              await requestCameraPermission();
            }
            setScannerActive(true);
            setScannedData(null);
            setActiveTab('barcode');
          }}
        >
          <Text style={styles.cardIcon}>🔎</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lector de Códigos</Text>
            <Text style={styles.cardDescription}>Escaneo en tiempo real de QR y códigos de barras.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderLeftColor: '#F59E0B' }]}
          onPress={() => {
            setActiveTab('location');
          }}
        >
          <Text style={styles.cardIcon}>📍</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ubicación y GPS</Text>
            <Text style={styles.cardDescription}>Coordenadas exactas, altitud y geocodificación inversa.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderLeftColor: '#8B5CF6' }]}
          onPress={() => {
            setSensorsActive(true);
            setActiveTab('sensors');
          }}
        >
          <Text style={styles.cardIcon}>📐</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Acelerómetro y Giroscopio</Text>
            <Text style={styles.cardDescription}>Medición de movimiento y orientación 3D en tiempo real.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderLeftColor: '#EC4899' }]}
          onPress={() => {
            setActiveTab('biometrics');
          }}
        >
          <Text style={styles.cardIcon}>🔐</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Biometría</Text>
            <Text style={styles.cardDescription}>Acceso seguro mediante huella dactilar o Face ID.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Text style={styles.footerText}>⚡ Listo para generación de APK nativo con EAS Build</Text>
      </View>
    </ScrollView>
  );

  // VISTA CÁMARA
  const renderCameraView = () => {
    if (!cameraPermission) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.warningText}>No se concedió permiso para la cámara.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestCameraPermission}>
            <Text style={styles.buttonText}>Otorgar Permiso</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.fullScreenContainer}>
        {renderHeader('Cámara')}
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={cameraFacing}
          >
            <View style={styles.cameraControlsOverlay}>
              <TouchableOpacity
                style={styles.camSwitchBtn}
                onPress={() =>
                  setCameraFacing((current) => (current === 'back' ? 'front' : 'back'))
                }
              >
                <Text style={styles.camBtnText}>🔄 Cambiar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shutterBtn} onPress={handleTakePhoto}>
                <View style={styles.innerShutterBtn} />
              </TouchableOpacity>

              <View style={{ width: 80 }} />
            </View>
          </CameraView>
        </View>

        {capturedPhotoUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Última captura:</Text>
            <Image source={{ uri: capturedPhotoUri }} style={styles.previewThumb} />
            <TouchableOpacity
              style={styles.secondarySmallBtn}
              onPress={() => setCapturedPhotoUri(null)}
            >
              <Text style={styles.secondaryBtnText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // VISTA ESCÁNER DE CÓDIGOS
  const renderBarcodeView = () => {
    return (
      <View style={styles.fullScreenContainer}>
        {renderHeader('Lector de Códigos')}
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'upc_a'],
            }}
            onBarcodeScanned={scannerActive ? handleBarCodeScanned : undefined}
          >
            <View style={styles.scannerTargetBox}>
              <View style={styles.scannerFrame} />
              <Text style={styles.scannerHint}>Apunta hacia un código QR o de barras</Text>
            </View>
          </CameraView>
        </View>

        <View style={styles.scannerResultContainer}>
          {scannedData ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultBadge}>Detectado ({scannedData.type})</Text>
              <Text style={styles.resultText} numberOfLines={3} selectable>
                {scannedData.data}
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setScannedData(null);
                  setScannerActive(true);
                }}
              >
                <Text style={styles.buttonText}>Escanear Otro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.waitingText}>Esperando código para escanear...</Text>
          )}
        </View>
      </View>
    );
  };

  // VISTA UBICACIÓN
  const renderLocationView = () => (
    <View style={styles.fullScreenContainer}>
      {renderHeader('Ubicación y GPS')}
      <ScrollView contentContainerStyle={styles.sensorContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGetLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>📍 Obtener Mi Ubicación Actual</Text>
          )}
        </TouchableOpacity>

        {locationData && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📡 Datos de Coordenadas</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Latitud:</Text>
              <Text style={styles.dataValue}>{locationData.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Longitud:</Text>
              <Text style={styles.dataValue}>{locationData.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Precisión:</Text>
              <Text style={styles.dataValue}>± {locationData.accuracy?.toFixed(1) ?? 'N/A'} m</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Altitud:</Text>
              <Text style={styles.dataValue}>{locationData.altitude?.toFixed(1) ?? 'N/A'} m</Text>
            </View>

            {addressData && (
              <View style={styles.addressBox}>
                <Text style={styles.addressTitle}>Dirección estimada:</Text>
                <Text style={styles.addressText}>
                  {addressData.street ? `${addressData.street} ${addressData.name || ''}, ` : ''}
                  {addressData.city || addressData.subregion}, {addressData.region} ({addressData.country})
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );

  // VISTA SENSORES
  const renderSensorsView = () => (
    <View style={styles.fullScreenContainer}>
      {renderHeader('Sensores de Movimiento')}
      <ScrollView contentContainerStyle={styles.sensorContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🚀 Acelerómetro (m/s²)</Text>
          <Text style={styles.infoSubtitle}>Detección de fuerzas de inercia y gravedad:</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Eje X:</Text>
            <Text style={styles.dataValue}>{accelerometerData.x.toFixed(3)}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Eje Y:</Text>
            <Text style={styles.dataValue}>{accelerometerData.y.toFixed(3)}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Eje Z:</Text>
            <Text style={styles.dataValue}>{accelerometerData.z.toFixed(3)}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🧭 Giroscopio (rad/s)</Text>
          <Text style={styles.infoSubtitle}>Velocidad angular de rotación:</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Rotación X:</Text>
            <Text style={styles.dataValue}>{gyroscopeData.x.toFixed(3)}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Rotación Y:</Text>
            <Text style={styles.dataValue}>{gyroscopeData.y.toFixed(3)}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Rotación Z:</Text>
            <Text style={styles.dataValue}>{gyroscopeData.z.toFixed(3)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: sensorsActive ? '#EF4444' : '#10B981' }]}
          onPress={() => setSensorsActive(!sensorsActive)}
        >
          <Text style={styles.buttonText}>
            {sensorsActive ? 'Pausar Monitoreo' : 'Iniciar Monitoreo'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // VISTA BIOMETRÍA
  const renderBiometricsView = () => (
    <View style={styles.fullScreenContainer}>
      {renderHeader('Biometría & Seguridad')}
      <ScrollView contentContainerStyle={styles.sensorContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🛡️ Estado del Dispositivo</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Huella/Facial enrolado:</Text>
            <Text style={[styles.dataValue, { color: isBiometricEnrolled ? '#10B981' : '#EF4444' }]}>
              {isBiometricEnrolled ? 'Sí, disponible' : 'No configurado'}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Último Resultado:</Text>
            <Text style={styles.dataValue}>{biometricStatus}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#EC4899' }]}
          onPress={handleAuthenticate}
        >
          <Text style={styles.buttonText}>🔒 Probar Autenticación Biométrica</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {activeTab === 'menu' && renderMenu()}
      {activeTab === 'camera' && renderCameraView()}
      {activeTab === 'barcode' && renderBarcodeView()}
      {activeTab === 'location' && renderLocationView()}
      {activeTab === 'sensors' && renderSensorsView()}
      {activeTab === 'biometrics' && renderBiometricsView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  menuScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  bannerContainer: {
    marginVertical: 15,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  gridContainer: {
    marginTop: 15,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  footerInfo: {
    marginTop: 25,
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  backBtnText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraControlsOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  camSwitchBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  camBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerShutterBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0F172A',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'space-between',
  },
  previewTitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  previewThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  secondarySmallBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  secondaryBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
  },
  scannerTargetBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  scannerHint: {
    color: '#FFFFFF',
    marginTop: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 13,
  },
  scannerResultContainer: {
    padding: 16,
    backgroundColor: '#1E293B',
  },
  resultBox: {
    gap: 8,
  },
  resultBadge: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultText: {
    color: '#F8FAFC',
    fontSize: 14,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  waitingText: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 13,
  },
  sensorContainer: {
    padding: 20,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dataLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  dataValue: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addressBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: '#0F172A',
    borderRadius: 8,
  },
  addressTitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  addressText: {
    color: '#F8FAFC',
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  warningText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
