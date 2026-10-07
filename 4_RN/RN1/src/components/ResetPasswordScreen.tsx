// src/components/ResetPasswordScreen.tsx

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../config/api';

interface ResetPasswordScreenProps {
  token: string;
  email?: string;
  onComplete: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  token,
  email: initialEmail,
  onComplete,
}) => {
  const [emailInput, setEmailInput] = useState(initialEmail || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!emailInput.trim()) {
      setErrorMsg('Por favor, ingresa tu correo electrónico o usuario.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Por favor, ingresa la nueva contraseña.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.NODE_RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email: emailInput.trim(),
          usuario: emailInput.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          onComplete();
        }, 2200);
      } else {
        setErrorMsg(data.message || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      setErrorMsg('⚠️ Error de conexión con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-sharp" size={32} color="#6366F1" />
          </View>

          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>
            Completa los datos para cambiar tu contraseña e ingresar inmediatamente.
          </Text>

          {errorMsg && (
            <View style={styles.alertDanger}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.alertDangerText}>{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View style={styles.alertSuccess}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.alertSuccessText}>{successMsg}</Text>
            </View>
          )}

          {/* Campo de Correo Electrónico o Usuario */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Correo Electrónico o Usuario</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="ej. salviamale08@gmail.com"
                placeholderTextColor="#9CA3AF"
                value={emailInput}
                onChangeText={setEmailInput}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo de Nueva Contraseña */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nueva Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Mínimo 4 caracteres"
                placeholderTextColor="#9CA3AF"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Confirmar Nueva Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="checkmark-done-outline" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Actualizar Contraseña</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onComplete}>
            <Text style={styles.cancelBtnText}>Volver al Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    maxWidth: 440,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
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
    width: '100%',
    gap: 10,
  },
  alertDangerText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
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
    width: '100%',
    gap: 10,
  },
  alertSuccessText: {
    color: '#6EE7B7',
    fontSize: 13,
    flex: 1,
  },
  fieldGroup: {
    width: '100%',
    marginBottom: 16,
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
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    height: 48,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#3730A3',
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 16,
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
