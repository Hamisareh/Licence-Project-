import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("📦 Token récupéré :", token);
      try {
        const { data } = await axios.get('http://192.168.251.20:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Données utilisateur :", data);
        setUser(data.user);
      } catch (err) {
        console.error('❌ Erreur lors de la récupération du profil :', err.response?.data || err.message);
      }
    };
    fetchUser();
  }, []);
  

  if (!user) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.prenom} {user.nom}</Text>
      <Text>Email : {user.email}</Text>
      <Text>Rôle : {user.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});