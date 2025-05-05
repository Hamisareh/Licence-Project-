import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { login } from '../api/auth';
import { saveToken } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Essayer de se connecter
      const { data } = await login(email, password);
      console.log('Réponse du backend:', data); // ← vérifier la réponse
  
      // Vérifier si on reçoit un token
      if (data && data.token) {
        // Sauvegarder le token + rôle dans AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('role', data.role);
  
        // ← ← ← Ajouter cette ligne pour vérifier ce qui est sauvegardé
        const savedToken = await AsyncStorage.getItem('token');
        console.log('Token sauvegardé après login:', savedToken);
  
        // Redirection vers la page d'accueil
        router.replace('/tabs/home');
      } else {
        // Si le token n'est pas présent, afficher une erreur
        Alert.alert('Erreur', 'Token manquant dans la réponse');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Connexion échouée';
      Alert.alert('Erreur', errorMessage);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register/step1')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: 'bold', color: '#000041' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: '#f9f9f9', color: '#000' },
  button: { backgroundColor: '#000041', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, color: '#ff7b00', textAlign: 'center', fontWeight: '600' },
});
