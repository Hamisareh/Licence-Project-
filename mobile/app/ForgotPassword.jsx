import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.90.20:5000/api/auth';
  const onRefresh = () => {
    setRefreshing(true);
    setEmail('');
    setMessage('');
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = async () => {
    if (!email) {
      setMessage('Veuillez entrer votre email');
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setMessage('Email invalide');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${api_URL}/send-reset-code`, 
        { email }
      );
      
      setMessage('Code envoyé! Vérifiez votre email.');
      
      setTimeout(() => {
        navigation.navigate('VerifyCode', { email });
      }, 2000);
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      setMessage(error.response?.data?.error || 'Erreur lors de l\'envoi');
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
          <Icon name="lock-reset" size={60} color="#000041" style={styles.icon} />
          <Text style={styles.title}>Mot de passe oublié ?</Text>
          <Text style={styles.subtitle}>Entrez votre email pour recevoir un code de réinitialisation</Text>
          
          <View style={[styles.inputContainer, message.includes('invalide') && styles.inputError]}>
            <Icon name="email" size={20} color="#7a7a9d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Veuillez entrer votre email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          {message && (
            <View style={styles.messageContainer}>
              <Icon 
                name={message.includes('envoyé') ? 'check-circle' : 'error'} 
                size={20} 
                color={message.includes('envoyé') ? '#000041' : '#ff7b00'} 
              />
              <Text style={[
                styles.messageText,
                { color: message.includes('envoyé') ? '#000041' : '#ff7b00' }
              ]}>
                {message}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.button, (!email || isLoading) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!email || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'ENVOI EN COURS...' : 'ENVOYER LE CODE'}
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
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00041',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000041',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },

  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000041',
  },
  button: {
    backgroundColor: '#000041',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
   
  },
  messageText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ForgotPassword;