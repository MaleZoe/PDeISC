// App.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LoginScreen } from './src/components/LoginScreen';
import { WelcomeScreen } from './src/components/WelcomeScreen';
import { ResetPasswordScreen } from './src/components/ResetPasswordScreen';
import { User } from './src/types/user';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  useEffect(() => {
    // Detectar si la app se abrió desde un enlace de restablecimiento en Web (search o hash o href)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const href = window.location.href;
      
      let token: string | null = null;
      let email: string | null = null;

      // Buscar en search ?resetToken=...
      const searchParams = new URLSearchParams(window.location.search);
      token = searchParams.get('resetToken');
      email = searchParams.get('email');

      // Si no estaba en search, buscar en hash #resetToken=...
      if (!token && window.location.hash) {
        const hashStr = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashStr.includes('?') ? hashStr.substring(hashStr.indexOf('?')) : hashStr);
        token = hashParams.get('resetToken');
        email = hashParams.get('email');
      }

      // Si se encontró resetToken o email en cualquier parte de la URL
      if (token || (href.includes('resetToken=') && href.includes('email='))) {
        if (!token && href.includes('resetToken=')) {
          const matchToken = href.match(/resetToken=([^&]+)/);
          if (matchToken) token = decodeURIComponent(matchToken[1]);
        }
        if (!email && href.includes('email=')) {
          const matchEmail = href.match(/email=([^&]+)/);
          if (matchEmail) email = decodeURIComponent(matchEmail[1]);
        }

        setResetToken(token || 'manual_reset');
        setResetEmail(email);
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleResetComplete = () => {
    setResetToken(null);
    setResetEmail(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {resetToken ? (
        <ResetPasswordScreen
          token={resetToken}
          email={resetEmail || undefined}
          onComplete={handleResetComplete}
        />
      ) : currentUser ? (
        <WelcomeScreen user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
