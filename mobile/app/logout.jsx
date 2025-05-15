import { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Logout() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Supprimer toutes les données d'authentification
        await AsyncStorage.multiRemove(['token', 'userData', 'role']);
        
        // 2. Rediriger vers login après un léger délai
        setTimeout(() => {
          router.replace('/login');
        }, 300);
        
      } catch (error) {
        Alert.alert('Erreur', 'Échec de la déconnexion');
        router.back(); // Revenir en arrière si échec
      }
    };
    
    performLogout();
  }, []);

  return null; // Pas de rendu visuel
}