import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next'; // Import de useTranslation

export default function Step1() {
  const { t } = useTranslation(); // Utilisation de useTranslation pour accéder aux traductions
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleNext = () => {
    setIsButtonPressed(true);
    setTimeout(() => {
      router.push('/register/step2');
    }, 100);
  };

  const handleCancel = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{t('title1')}</Text> {/* Utilisation de t() pour la traduction du titre */}

        <TextInput
          style={styles.input}
          placeholder={t('name')} // Utilisation de t() pour la traduction des placeholders
          value={nom}
          onChangeText={setNom}
        />
          <TextInput
          style={styles.input}
          placeholder={t('prenom')} // Utilisation de t() pour la traduction des placeholders
          value={nom}
          onChangeText={setPrenom}
        />
        <TextInput
          style={styles.input}
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t('confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            isButtonPressed && { backgroundColor: '#ff7b00' },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>{t('next')}</Text> {/* Traduction du bouton Suivant */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>{t('cancel')}</Text> {/* Traduction du bouton Annuler */}
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
    color: '#000041',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
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
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ff7b00',
    fontWeight: '600',
  },
});
