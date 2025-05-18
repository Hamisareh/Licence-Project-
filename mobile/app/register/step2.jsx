import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

  useEffect(() => {
    setUniversite(registerData.universite || '');
    setSpecialite(registerData.specialite || '');
    setNiveau(registerData.niveau || '');
    setDepartement(registerData.departement || '');
    setMatricule(registerData.matricule || '');
  }, [registerData]);

  const handleSubmit = async () => {
    if (!matricule || !universite || !specialite || !niveau || !departement) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

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
      setRegisterData({});
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
      

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Département:</Text>
        <Picker
          selectedValue={departement}
          style={styles.picker}
          onValueChange={(itemValue) => setDepartement(itemValue)}
          dropdownIconColor="#000041"
        >
          <Picker.Item label="Sélectionnez un département" value="" />
          {departements.map((dept, index) => (
            <Picker.Item key={index} label={dept} value={dept} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Niveau:</Text>
        <Picker
          selectedValue={niveau}
          style={styles.picker}
          onValueChange={(itemValue) => setNiveau(itemValue)}
          dropdownIconColor="#000041"
        >
          <Picker.Item label="Sélectionnez un niveau" value="" />
          {niveaux.map((niv, index) => (
            <Picker.Item key={index} label={niv} value={niv} />
          ))}
        </Picker>
      </View>
      <TextInput 
        style={styles.input} 
        placeholder="Spécialité" 
        value={specialite} 
        onChangeText={setSpecialite} 
      />
      <TouchableOpacity 
        style={[styles.button, (!matricule || !universite || !specialite || !niveau || !departement) && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={!matricule || !universite || !specialite || !niveau || !departement}
      >
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Retour à l'étape précédente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 22, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold', 
    color: '#000041' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#f9f9f9', 
    color: '#000' 
  },
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  pickerLabel: {
    paddingLeft: 12,
    paddingTop: 8,
    color: '#666',
    fontSize: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  button: { 
    backgroundColor: '#000041', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  backButton: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  backText: { 
    color: '#000041', 
    fontWeight: '600' 
  },
});