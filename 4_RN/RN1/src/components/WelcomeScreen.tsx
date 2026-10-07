// src/components/WelcomeScreen.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types/user';

export interface WelcomeScreenProps {
  user: User;
  onLogout: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onLogout }) => {
  // Estado para controlar la visibilidad del Modal de confirmación de cierre de sesión
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <View style={styles.mainWrapper}>
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <View style={styles.topNavbar}>
        <View style={styles.brandGroup}>
          <View style={styles.brandIconBox}>
            <Ionicons name="shield-checkmark-sharp" size={20} color="#6366F1" />
          </View>
          <Text style={styles.brandTitle}>
            Secure<Text style={styles.brandTitleHighlight}>Auth</Text>
          </Text>
        </View>

        <View style={styles.navbarRight}>
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusBadgeText}>MySQL Conectado</Text>
          </View>

          {/* Único botón de Salir en el Margen Superior */}
          <TouchableOpacity
            style={styles.navLogoutBtn}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={16} color="#EF4444" />
            <Text style={styles.navLogoutBtnText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          
          {/* HERO BANNER DE BIENVENIDA */}
          <View style={styles.welcomeHero}>
            <View style={styles.userAvatarBox}>
              <Text style={styles.avatarInitials}>{getInitials(user.nombre)}</Text>
            </View>

            <View style={styles.welcomeHeaderInfo}>
              <Text style={styles.welcomeGreeting}>¡Bienvenido/a de nuevo! 👋</Text>
              <Text style={styles.userNameText}>{user.nombre}</Text>
              <View style={styles.roleChip}>
                <Ionicons name="sparkles" size={12} color="#818CF8" />
                <Text style={styles.roleChipText}>Rol: {user.rol}</Text>
              </View>
            </View>
          </View>

          {/* ESTADÍSTICAS RÁPIDAS DEL SISTEMA */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="key-outline" size={22} color="#6366F1" />
              <Text style={styles.statValue}>Activa</Text>
              <Text style={styles.statLabel}>Estado de Sesión</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="server-outline" size={22} color="#10B981" />
              <Text style={styles.statValue}>MySQL DB</Text>
              <Text style={styles.statLabel}>Motor de Datos</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="shield-outline" size={22} color="#F59E0B" />
              <Text style={styles.statValue}>{user.rol}</Text>
              <Text style={styles.statLabel}>Permisos Asignados</Text>
            </View>
          </View>

          {/* TARJETA DE DETALLES DEL USUARIO (DATOS PASADOS POR PROPS) */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsCardHeader}>
              <Ionicons name="card-outline" size={20} color="#818CF8" />
              <Text style={styles.detailsCardTitle}>Información del Usuario (Recibida por Props)</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Único de Sistema</Text>
              <Text style={styles.infoValueHighlight}>#{user.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre de Usuario</Text>
              <Text style={styles.infoValue}>@{user.usuario}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre Completo</Text>
              <Text style={styles.infoValue}>{user.nombre}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Nivel de Acceso</Text>
              <View style={styles.accessBadge}>
                <Text style={styles.accessBadgeText}>{user.rol}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* MODAL DE CONFIRMACIÓN PARA CERRAR SESIÓN */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="log-out" size={28} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>¿Cerrar Sesión?</Text>
            <Text style={styles.modalSubtitle}>
              ¿Estás seguro de que deseas salir del sistema? Tendrás que ingresar tus credenciales nuevamente para acceder.
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmLogout}
                activeOpacity={0.85}
              >
                <Text style={styles.modalConfirmBtnText}>Sí, Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topNavbar: {
    height: 64,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  brandTitleHighlight: {
    color: '#818CF8',
  },
  navbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  navLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  navLogoutBtnText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 800,
    gap: 20,
  },
  welcomeHero: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    gap: 20,
  },
  userAvatarBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  welcomeHeaderInfo: {
    flex: 1,
  },
  welcomeGreeting: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  userNameText: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#312E81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  roleChipText: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  detailsCardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValueHighlight: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '700',
  },
  accessBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  accessBadgeText: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '700',
  },

  // ESTILOS DEL MODAL DE CONFIRMACIÓN
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
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
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
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
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
