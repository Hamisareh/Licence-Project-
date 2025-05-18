import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, RefreshControl, ScrollView } from 'react-native';
import axios from 'axios';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChangePassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.246.20:5000/api/auth';
  const onRefresh = () => {
    setRefreshing(true);
    // Réinitialiser les champs et les messages
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleChangePassword = async () => {
    if (password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${api_URL}/set-new-password`,
        { email, newPassword: password }
      );
      
      Alert.alert('Succès', 'Mot de passe changé avec succès!', [
        { text: 'OK', onPress: () => navigation.navigate('login') }
      ]);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erreur lors du changement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#000041']}
          tintColor="#000041"
        />
      }
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Réinitialisation du mot de passe</Text>
          <Text style={styles.subtitle}>Pour l'adresse :</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <View style={[styles.inputContainer, message.includes('correspondent') && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nouveau mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setMessage('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#7a7a9d" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmez le mot de passe</Text>
            <View style={[styles.inputContainer, message.includes('correspondent') && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setMessage('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#7a7a9d" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {message && (
            <View style={styles.messageContainer}>
              <Icon name="error-outline" size={20} color="#ff7b00" />
              <Text style={styles.errorText}>{message}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, (!password || !confirmPassword || isLoading) && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={!password || !confirmPassword || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'TRAITEMENT...' : 'VALIDER'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000041',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000041',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
  },
  inputError: {
    borderColor: '#ff7b00',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000041',
  },
  button: {
    backgroundColor: '#000041',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    color: '#ff7b00',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default ChangePassword;