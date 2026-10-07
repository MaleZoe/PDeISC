// src/components/LoginScreen.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { User, LoginResponse, ValidationErrors } from '../types/user';
import { DEFAULT_API_URL, API_ENDPOINTS } from '../config/api';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  // Estado del Tab Activo: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // ESTADOS DE LOGIN
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ usuario?: boolean; password?: boolean }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // ESTADOS DE REGISTRO
  const [regNombre, setRegNombre] = useState('');
  const [regUsuario, setRegUsuario] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState<{ [key: string]: string }>({});
  const [regServerError, setRegServerError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // URL del Backend
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);

  // ESTADOS DEL MODAL DE ENVÍO DE CORREO REAL
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    previewUrl?: string;
  } | null>(null);

  const validateLoginField = (name: 'usuario' | 'password', value: string) => {
    let newErrors = { ...errors };

    if (name === 'usuario') {
      if (!value.trim()) {
        newErrors.usuario = 'El usuario o correo es obligatorio.';
      } else if (value.trim().length < 3) {
        newErrors.usuario = 'Debe tener al menos 3 caracteres.';
      } else if (value.includes('@') && !/\S+@\S+\.\S+/.test(value)) {
        newErrors.usuario = 'Ingresa un correo electrónico válido.';
      } else {
        delete newErrors.usuario;
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        newErrors.password = 'La contraseña es obligatoria.';
      } else if (value.length < 4) {
        newErrors.password = 'Mínimo 4 caracteres requeridos.';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlurLogin = (field: 'usuario' | 'password') => {
    setTouched({ ...touched, [field]: true });
    validateLoginField(field, field === 'usuario' ? usuario : password);
  };

  const handleLogin = async () => {
    setServerError(null);
    setTouched({ usuario: true, password: true });

    const isUsuarioValid = validateLoginField('usuario', usuario);
    const isPasswordValid = validateLoginField('password', password);

    if (!isUsuarioValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password: password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
      } else {
        setServerError(data.message || 'Credenciales no válidas. Revisa usuario y contraseña.');
      }
    } catch (error: any) {
      console.error('Error de conexión:', error);
      setServerError(
        '⚠️ No se pudo conectar con el Backend API. Verifica que el servidor esté activo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const validateRegister = () => {
    let errs: { [key: string]: string } = {};

    if (!regNombre.trim()) {
      errs.nombre = 'El nombre completo es obligatorio.';
    }

    if (!regUsuario.trim()) {
      errs.usuario = 'El nombre de usuario es obligatorio.';
    } else if (regUsuario.trim().length < 3) {
      errs.usuario = 'Debe tener al menos 3 caracteres.';
    }

    if (!regEmail.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(regEmail.trim())) {
      errs.email = 'Ingresa un formato de correo válido (ej. usuario@dominio.com).';
    }

    if (!regPassword) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (regPassword.length < 4) {
      errs.password = 'La contraseña debe tener al menos 4 caracteres.';
    }

    if (regPassword !== regConfirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    setRegServerError(null);
    setRegSuccessMessage(null);

    if (!validateRegister()) {
      return;
    }

    setRegLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.NODE_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: regNombre.trim(),
          usuario: regUsuario.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setRegSuccessMessage('¡Cuenta creada exitosamente! Iniciando sesión...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1200);
      } else {
        setRegServerError(data.message || 'No se pudo crear la cuenta.');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setRegServerError('⚠️ Error de conexión con el backend al intentar registrar la cuenta.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    setForgotMessage(null);

    if (!forgotInput.trim()) {
      setForgotMessage({
        type: 'error',
        text: 'Por favor, ingresa tu usuario o correo electrónico.',
      });
      return;
    }

    setForgotLoading(true);

    try {
      const currentAppUrl =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';

      const response = await fetch(API_ENDPOINTS.NODE_FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: forgotInput.trim(),
          appUrl: currentAppUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotMessage({
          type: 'success',
          text: data.message,
          previewUrl: data.previewUrl,
        });
      } else {
        setForgotMessage({
          type: 'error',
          text: data.message || 'No encontramos ninguna cuenta registrada con esos datos.',
        });
      }
    } catch (error: any) {
      console.error('Error al enviar correo por backend:', error);
      setForgotMessage({
        type: 'error',
        text: '⚠️ No se pudo enviar el correo. Verifica que el servidor backend Node.js esté encendido.',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setForgotInput(usuario);
    setForgotMessage(null);
    setShowForgotModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={[styles.cardContainer, isLargeScreen && styles.cardContainerSplit]}>
          
          {/* LADO IZQUIERDO: Hero Visual Moderno */}
          <View style={[styles.heroSection, isLargeScreen ? styles.heroSectionSplit : styles.heroSectionMobile]}>
            <View style={styles.badgePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.badgePillText}>Sistema v2.5 • React Native & Expo</Text>
            </View>

            <Text style={styles.heroTitle}>
              Portal de Acceso <Text style={styles.heroGradientText}>Inteligente</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Envío real de correos desde salviamale08@gmail.com, restablecimiento por token y base de datos MySQL.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureCard}>
                <Ionicons name="mail-unread" size={20} color="#6366F1" />
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Gmail SMTP Activo</Text>
                  <Text style={styles.featureDesc}>Enviado desde salviamale08@gmail.com</Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="key" size={20} color="#10B981" />
                <View style={styles.featureTextCol}>
                  <Text style={styles.featureTitle}>Token de Cambio</Text>
                  <Text style={styles.featureDesc}>Enlace directo para actualizar clave</Text>
                </View>
              </View>
            </View>
          </View>

          {/* LADO DERECHO: Formulario */}
          <View style={styles.formSection}>

            <View style={styles.tabBarContainer}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'login' && styles.tabBtnActive]}
                onPress={() => setActiveTab('login')}
              >
                <Ionicons
                  name="log-in-outline"
                  size={16}
                  color={activeTab === 'login' ? '#818CF8' : '#94A3B8'}
                />
                <Text style={[styles.tabBtnText, activeTab === 'login' && styles.tabBtnTextActive]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'register' && styles.tabBtnActive]}
                onPress={() => setActiveTab('register')}
              >
                <Ionicons
                  name="person-add-outline"
                  size={16}
                  color={activeTab === 'register' ? '#818CF8' : '#94A3B8'}
                />
                <Text style={[styles.tabBtnText, activeTab === 'register' && styles.tabBtnTextActive]}>
                  Crear Cuenta
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB 1: INICIAR SESIÓN */}
            {activeTab === 'login' && (
              <>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Iniciar Sesión</Text>
                  <Text style={styles.formSubtitle}>Ingresa tus credenciales para continuar</Text>
                </View>

                {serverError && (
                  <View style={styles.alertDanger}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={styles.alertDangerText}>{serverError}</Text>
                  </View>
                )}

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Usuario o Correo Electrónico</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.usuario && errors.usuario && styles.inputWrapperError,
                      touched.usuario && !errors.usuario && usuario.length > 0 && styles.inputWrapperSuccess,
                    ]}
                  >
                    <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="ej. admin o admin@ejemplo.com"
                      placeholderTextColor="#9CA3AF"
                      value={usuario}
                      onChangeText={(text) => {
                        setUsuario(text);
                        if (touched.usuario) validateLoginField('usuario', text);
                      }}
                      onBlur={() => handleBlurLogin('usuario')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {touched.usuario && !errors.usuario && usuario.length > 0 && (
                      <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    )}
                  </View>
                  {touched.usuario && errors.usuario && (
                    <Text style={styles.fieldErrorText}>• {errors.usuario}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Contraseña</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.password && errors.password && styles.inputWrapperError,
                      touched.password && !errors.password && password.length > 0 && styles.inputWrapperSuccess,
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (touched.password) validateLoginField('password', text);
                      }}
                      onBlur={() => handleBlurLogin('password')}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeToggleBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.fieldErrorText}>• {errors.password}</Text>
                  )}
                </View>

                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={styles.checkboxLabel}>Recordarme</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleOpenForgotModal} activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.submitBtnContent}>
                      <Text style={styles.submitBtnText}>Iniciar Sesión</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchTabLink}
                  onPress={() => setActiveTab('register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.switchTabLinkText}>
                    ¿No tienes una cuenta? <Text style={styles.switchTabLinkHighlight}>Regístrate aquí</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* TAB 2: REGISTRO DE USUARIOS */}
            {activeTab === 'register' && (
              <>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Crear Nueva Cuenta</Text>
                  <Text style={styles.formSubtitle}>Completa el formulario para registrarte</Text>
                </View>

                {regServerError && (
                  <View style={styles.alertDanger}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={styles.alertDangerText}>{regServerError}</Text>
                  </View>
                )}

                {regSuccessMessage && (
                  <View style={styles.alertSuccess}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.alertSuccessText}>{regSuccessMessage}</Text>
                  </View>
                )}

                <View style={styles.fieldGroupSmall}>
                  <Text style={styles.fieldLabel}>Nombre Completo</Text>
                  <View style={[styles.inputWrapper, regErrors.nombre && styles.inputWrapperError]}>
                    <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="ej. Carlos Rodríguez"
                      placeholderTextColor="#9CA3AF"
                      value={regNombre}
                      onChangeText={setRegNombre}
                    />
                  </View>
                  {regErrors.nombre && <Text style={styles.fieldErrorText}>• {regErrors.nombre}</Text>}
                </View>

                <View style={styles.fieldGroupSmall}>
                  <Text style={styles.fieldLabel}>Nombre de Usuario</Text>
                  <View style={[styles.inputWrapper, regErrors.usuario && styles.inputWrapperError]}>
                    <Ionicons name="at-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="ej. carlos2026"
                      placeholderTextColor="#9CA3AF"
                      value={regUsuario}
                      onChangeText={setRegUsuario}
                      autoCapitalize="none"
                    />
                  </View>
                  {regErrors.usuario && <Text style={styles.fieldErrorText}>• {regErrors.usuario}</Text>}
                </View>

                <View style={styles.fieldGroupSmall}>
                  <Text style={styles.fieldLabel}>Correo Electrónico Real</Text>
                  <View style={[styles.inputWrapper, regErrors.email && styles.inputWrapperError]}>
                    <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="tu_correo@gmail.com"
                      placeholderTextColor="#9CA3AF"
                      value={regEmail}
                      onChangeText={setRegEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {regErrors.email && <Text style={styles.fieldErrorText}>• {regErrors.email}</Text>}
                </View>

                <View style={styles.fieldGroupSmall}>
                  <Text style={styles.fieldLabel}>Contraseña</Text>
                  <View style={[styles.inputWrapper, regErrors.password && styles.inputWrapperError]}>
                    <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Mínimo 4 caracteres"
                      placeholderTextColor="#9CA3AF"
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry={!regShowPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setRegShowPassword(!regShowPassword)}
                      style={styles.eyeToggleBtn}
                    >
                      <Ionicons
                        name={regShowPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {regErrors.password && <Text style={styles.fieldErrorText}>• {regErrors.password}</Text>}
                </View>

                <View style={styles.fieldGroupSmall}>
                  <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
                  <View style={[styles.inputWrapper, regErrors.confirmPassword && styles.inputWrapperError]}>
                    <Ionicons name="checkmark-done-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor="#9CA3AF"
                      value={regConfirmPassword}
                      onChangeText={setRegConfirmPassword}
                      secureTextEntry={!regShowPassword}
                    />
                  </View>
                  {regErrors.confirmPassword && (
                    <Text style={styles.fieldErrorText}>• {regErrors.confirmPassword}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, regLoading && styles.submitBtnDisabled, { marginTop: 10 }]}
                  onPress={handleRegister}
                  disabled={regLoading}
                  activeOpacity={0.85}
                >
                  {regLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.submitBtnContent}>
                      <Text style={styles.submitBtnText}>Registrar Cuenta</Text>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchTabLink}
                  onPress={() => setActiveTab('login')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.switchTabLinkText}>
                    ¿Ya tienes una cuenta? <Text style={styles.switchTabLinkHighlight}>Inicia sesión aquí</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </ScrollView>

      {/* MODAL DE ENVÍO DE CORREO POR GMAIL */}
      <Modal
        visible={showForgotModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowForgotModal(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.modalIconCircle}>
              <Ionicons name="mail-unread-outline" size={28} color="#6366F1" />
            </View>

            <Text style={styles.modalTitle}>Enviar Correo de Recuperación</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa tu usuario o correo. Se despachará un correo electrónico real desde <Text style={{ color: '#818CF8', fontWeight: '700' }}>salviamale08@gmail.com</Text> con el enlace para cambiar tu contraseña.
            </Text>

            {forgotMessage && (
              <View style={styles.modalAlertContainer}>
                <View
                  style={[
                    styles.modalAlert,
                    forgotMessage.type === 'success' ? styles.modalAlertSuccess : styles.modalAlertDanger,
                  ]}
                >
                  <Ionicons
                    name={forgotMessage.type === 'success' ? 'send' : 'alert-circle'}
                    size={20}
                    color={forgotMessage.type === 'success' ? '#10B981' : '#EF4444'}
                  />
                  <Text
                    style={[
                      styles.modalAlertText,
                      forgotMessage.type === 'success' ? styles.modalAlertTextSuccess : styles.modalAlertTextDanger,
                    ]}
                  >
                    {forgotMessage.text}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.fieldGroupModal}>
              <Text style={styles.fieldLabel}>Usuario o Correo Electrónico Destino</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="ej. salviamale08@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  value={forgotInput}
                  onChangeText={setForgotInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowForgotModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSubmitBtn, forgotLoading && styles.submitBtnDisabled]}
                onPress={handleForgotPasswordSubmit}
                disabled={forgotLoading}
                activeOpacity={0.85}
              >
                {forgotLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Enviar Correo por Gmail</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 1050,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardContainerSplit: {
    flexDirection: 'row',
    minHeight: 620,
  },
  heroSection: {
    backgroundColor: '#1E1B4B',
    padding: 36,
    justifyContent: 'center',
  },
  heroSectionSplit: {
    width: '45%',
    borderRightWidth: 1,
    borderRightColor: '#312E81',
  },
  heroSectionMobile: {
    width: '100%',
    paddingVertical: 28,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    marginBottom: 16,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  badgePillText: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 12,
  },
  heroGradientText: {
    color: '#818CF8',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 28,
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  featureDesc: {
    color: '#64748B',
    fontSize: 11,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 36,
    justifyContent: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  tabBtnActive: {
    backgroundColor: '#312E81',
  },
  tabBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  tabBtnTextActive: {
    color: '#818CF8',
    fontWeight: '700',
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  alertDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertDangerText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
  alertSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertSuccessText: {
    color: '#6EE7B7',
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldGroupSmall: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  inputWrapperSuccess: {
    borderColor: '#10B981',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    height: '100%',
  },
  eyeToggleBtn: {
    padding: 4,
  },
  fieldErrorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkboxLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  forgotPasswordText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#3730A3',
    opacity: 0.7,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  switchTabLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchTabLinkText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  switchTabLinkHighlight: {
    color: '#818CF8',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalAlertContainer: {
    width: '100%',
    marginBottom: 18,
    gap: 8,
  },
  modalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    gap: 10,
  },
  modalAlertSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  modalAlertDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalAlertText: {
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
    lineHeight: 18,
  },
  modalAlertTextSuccess: {
    color: '#6EE7B7',
  },
  modalAlertTextDanger: {
    color: '#FCA5A5',
  },
  fieldGroupModal: {
    width: '100%',
    marginBottom: 20,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
