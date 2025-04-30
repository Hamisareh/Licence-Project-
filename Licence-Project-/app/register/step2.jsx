import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function Step2() {
  const { t } = useTranslation();  // Utilisation du hook pour obtenir les traductions

  const [universite, setUniversite] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [niveau, setNiveau] = useState('');
  const [departement, setDepartement] = useState('');

  const handleSubmit = () => {
    // Tu peux ici enregistrer les données avec Supabase ou autre
    Alert.alert(t('submit'), 'Inscription réussie ✅');
    router.replace('/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{t('title')}</Text>

        <TextInput style={styles.input} placeholder={t('university')} value={universite} onChangeText={setUniversite} />
        <TextInput style={styles.input} placeholder={t('speciality')} value={specialite} onChangeText={setSpecialite} />
        <TextInput style={styles.input} placeholder={t('level')} value={niveau} onChangeText={setNiveau} />
        <TextInput style={styles.input} placeholder={t('department')} value={departement} onChangeText={setDepartement} />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('submit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>{t('back2')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color:'#000041',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: 'rgba(0, 0, 0, 0.96)',
  },
  button: {
    backgroundColor: '#000041',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backText: {
    color:  '#ff7b00',
    fontWeight: '600',
  },
});
