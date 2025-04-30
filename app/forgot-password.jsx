import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    if (!email.includes('@')) {
      Alert.alert(t('invalid_email_title'), t('invalid_email_message'));
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      Alert.alert(t('email_sent_title'), t('email_sent_message'));
      router.replace('/login');
    }, 200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('reset_password')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('enter_email')}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, submitted && { backgroundColor: '#ff7b00' }]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>{t('send_link')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>{t('back')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000041',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    backgroundColor: '#000041',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#ff7b00',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
  },
});
