import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function ProfileDetails() {
  const departements = [
    'Informatique',
    'Mathematiques',
    'Physique',
    'Agronomie',
    'SNV',
    'Biologie',
    'STAPS',
    'Chimie'
  ];

  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    universite: '',
    specialite: '',
    niveau: '',
    departement: '',
    matricule: '',
  });

  // ... (le reste de vos useEffect et fonctions existants restent inchangés)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('http://192.168.90.20:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseText = await res.text();
        console.log('Réponse brute du serveur:', responseText);

        try {
          const data = JSON.parse(responseText);
          console.log('Données utilisateur :', data);
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
              matricule: u.matricule || ''
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

      const res = await fetch('http://192.168.90.20:5000/api/auth/me', {
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
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
          {['nom', 'prenom', 'email', 'matricule'].map((key) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TextInput
                style={styles.input}
                value={form[key]}
                onChangeText={(text) => handleChange(key, text)}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations Académiques</Text>
          
          {/* Champ Université */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Universite</Text>
            <TextInput
              style={styles.input}
              value={form.universite}
              onChangeText={(text) => handleChange('universite', text)}
            />
          </View>

          {/* Sélecteur de Département */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Departement</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.departement}
                onValueChange={(itemValue) => handleChange('departement', itemValue)}
                style={styles.picker}
                dropdownIconColor="#000041"
              >
                <Picker.Item label="Sélectionnez un département" value="" />
                {departements.map((dept) => (
                  <Picker.Item key={dept} label={dept} value={dept} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Champ Spécialité */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Specialite</Text>
            <TextInput
              style={styles.input}
              value={form.specialite}
              onChangeText={(text) => handleChange('specialite', text)}
            />
          </View>

          {/* Sélecteur de Niveau */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Niveau</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.niveau}
                onValueChange={(itemValue) => handleChange('niveau', itemValue)}
                style={styles.picker}
                dropdownIconColor="#000041"
              >
                <Picker.Item label="Sélectionnez un niveau" value="" />
                {niveaux.map((niv) => (
                  <Picker.Item key={niv} label={niv} value={niv} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Mettre à jour</Text>
          <Ionicons name="checkmark-circle" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (tous vos styles existants restent inchangés)
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000041',
  },
  headerRightPlaceholder: {
    width: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
    marginTop: 10,
  },
  profileMatricule: {
    fontSize: 14,
    color: '#ff7b00',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
    
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#000041',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  // Ajoutez ces nouveaux styles pour les Picker
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
});