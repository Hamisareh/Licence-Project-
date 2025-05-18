import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

import { useRoute, useNavigation } from '@react-navigation/native';

const VerifyCode = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || {};
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const api_URL = 'http://192.168.246.20:5000/api/auth';
  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    if (!email) {
      setMessage('Aucun email associé à cette demande');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${api_URL}/verify-reset-code`, { 
        email, 
        code 
      });
      navigation.navigate('ChangePassword', { email });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Code incorrect ou expiré');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Vérification du code</Text>
        <Text style={styles.subtitle}>
          Entrez le code à 6 chiffres envoyé à {'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <TextInput
          style={[styles.codeInput, message.includes('incorrect') && styles.inputError]}
          placeholder="• • • • • •"
          placeholderTextColor="#aaa"
          value={code}
          onChangeText={(text) => {
            setCode(text.replace(/[^0-9]/g, ''));
            setMessage('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          selectionColor="#000041"
        />

        {message ? (
          <Text style={styles.errorText}>{message}</Text>
        ) : (
          <Text style={styles.hintText}>Vérifiez votre boîte mail</Text>
        )}

        <TouchableOpacity 
          style={[styles.button, (!code || isLoading) && styles.disabledButton]}
          onPress={handleVerifyCode}
          disabled={!code || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'VÉRIFICATION...' : 'VÉRIFIER'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    color: '#000041',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  email: {
    color: '#000041',
    fontWeight: '600',
  },
  codeInput: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 10,
    color: '#000041',
    marginBottom: 20,
  },
  inputError: {
    borderColor: '#ff7b00',
  },
  button: {
    backgroundColor: '#000041',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#ff7b00',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  hintText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 14,
  },
});

export default VerifyCode;