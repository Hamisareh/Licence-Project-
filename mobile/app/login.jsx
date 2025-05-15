import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { login } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await login(email, password);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('role', data.role);

      router.replace('/tabs/home');
    } catch (err) {
      console.error("Erreur de connexion :", err);
      const errorMessage = err.response?.data?.error || err.message || 'Connexion échouée';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            <Text style={styles.orange}>Stage</Text>
            <Text style={styles.darkBlue}>Flow</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[
            styles.inputContainer, 
            isFocused.email && styles.inputFocused,
            email && styles.inputFilled
          ]}>
            <Text style={[
              styles.floatingLabel,
              (isFocused.email || email) && styles.floatingLabelUp
            ]}>
              EMAIL
            </Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="transparent"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
            />
          </View>

          <View style={[
            styles.inputContainer, 
            isFocused.password && styles.inputFocused,
            password && styles.inputFilled
          ]}>
            <Text style={[
              styles.floatingLabel,
              (isFocused.password || password) && styles.floatingLabelUp
            ]}>
              MOT DE PASSE
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="transparent"
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons 
                name={showPassword ? 'visibility' : 'visibility-off'} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, (!email || !password || isLoading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Nouveau sur StageFlow ? </Text>
        <TouchableOpacity onPress={() => router.push('/register/step1')}>
          <Text style={styles.footerLink}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orange: {
    color: '#ff7b00',
  },
  darkBlue: {
    color: '#000041',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    height: 60,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: '#000041',
  },
  inputFilled: {
    borderColor: '#000041',
  },
  floatingLabel: {
    position: 'absolute',
    left: 15,
    top: 20,
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.5,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
    transform: [{ translateY: 0 }],
  },
  floatingLabelUp: {
    top: -10,
    fontSize: 12,
    color: '#000041',
    transform: [{ translateY: 0 }],
  },
  input: {
    fontSize: 16,
    color: '#000',
    height: 40,
    paddingTop: 10,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 18,
  },
  button: {
    backgroundColor: '#000041',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#000041',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  footerText: {
    color: '#000041',
  },
  footerLink: {
    color: '#ff7b00',
    fontWeight: '600',
  },
});