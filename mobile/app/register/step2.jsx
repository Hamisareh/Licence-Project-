import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../../context/RegisterContext';
import { registerEtudiant } from '../../api/auth';

export default function Step2() {
  const { t } = useTranslation();
  const { registerData, setRegisterData } = useRegister();

  const [universite, setUniversite] = useState(registerData.universite || '');
  const [specialite, setSpecialite] = useState(registerData.specialite || '');
  const [niveau, setNiveau] = useState(registerData.niveau || '');
  const [departement, setDepartement] = useState(registerData.departement || '');
  const [matricule, setMatricule] = useState(registerData.matricule || '');

  useEffect(() => {
    // Assure-toi que les données de Step1 sont disponibles dans Step2
    setUniversite(registerData.universite || '');
    setSpecialite(registerData.specialite || '');
    setNiveau(registerData.niveau || '');
    setDepartement(registerData.departement || '');
    setMatricule(registerData.matricule || '');

  }, [registerData]);

  const handleSubmit = async () => {
    try {
      const fullData = {
        ...registerData,
        universite,
        specialite,
        niveau,
        departement,
        matricule,
      };

      await registerEtudiant(fullData);
      Alert.alert('Succès', 'Inscription réussie ✅');
      setRegisterData({}); // Reset register data after successful registration
      router.replace('/login');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Erreur serveur');
    }
  };

  const handleBack = () => {
    setRegisterData(prev => ({
      ...prev,
      universite,
      specialite,
      niveau,
      departement,
      matricule,
    }));
    router.push('/register/step1');
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations académiques</Text>
      <TextInput 
  style={styles.input} 
  placeholder="Matricule" 
  value={matricule} 
  onChangeText={setMatricule} 
/>
      <TextInput 
        style={styles.input} 
        placeholder="Université" 
        value={universite} 
        onChangeText={setUniversite} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Spécialité" 
        value={specialite} 
        onChangeText={setSpecialite} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Niveau" 
        value={niveau} 
        onChangeText={setNiveau} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Département" 
        value={departement} 
        onChangeText={setDepartement} 
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      {/* Retour à Step 1 si l'utilisateur veut revenir et modifier ses informations */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Retour à l'étape précédente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20, fontWeight: 'bold', color: '#000041' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: '#f9f9f9', color: '#000' },
  button: { backgroundColor: '#000041', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backButton: { marginTop: 10, alignItems: 'center' },
  backText: { color: '#000041', fontWeight: '600' },
});
