import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileDetails() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    universite: '',
    specialite: '',
    niveau: '',
    departement: '',
    mdps: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('http://192.168.1.4:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Vérifie la réponse brute
        const responseText = await res.text();  // Récupère la réponse sous forme de texte brut
        console.log('Réponse brute du serveur:', responseText);  // Affiche la réponse brute pour comprendre ce que le serveur renvoie
  
        try {
          const data = JSON.parse(responseText);  // Tente de parser la réponse en JSON
          console.log('Données utilisateur :', data);  // Affiche les données utilisateur
          if (res.ok) {
            const u = data.user;
            setForm({
              nom: u.nom,
              prenom: u.prenom,
              email: u.email,
              universite: u.universite || '',
              specialite: u.specialite || '',
              niveau: u.niveau || '',
              departement: u.departement || '',
              mdps: '',
            });
          } else {
            Alert.alert('Erreur', data.error || 'Échec de chargement');
          }
        } catch (error) {
          console.error('Erreur de parsing JSON :', error);
          Alert.alert('Erreur', 'La réponse du serveur n\'est pas au format JSON');
        }
  
      } catch (err) {
        console.error(err);
        Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur');
      }
    };
  
    fetchUser();
  }, []);
  
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erreur', 'Token manquant. Vous devez vous connecter.');
        return;
      }

      const res = await fetch('http://192.168.1.4:5000/api/auth/me', {  // Remplace '192.168.x.x' par l'IP locale
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      } else {
        Alert.alert('Erreur', data.error || 'Échec de mise à jour');
      }
    } catch (err) {
      console.error('Erreur de mise à jour:', err);
      Alert.alert('Erreur', 'Impossible de mettre à jour');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mes informations</Text>

      {['nom', 'prenom', 'email', 'universite', 'departement', 'specialite', 'niveau'].map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe (laisser vide si inchangé)"
        value={form.mdps}
        secureTextEntry
        onChangeText={(text) => handleChange('mdps', text)}
      />

      <Button title="Mettre à jour" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
});
