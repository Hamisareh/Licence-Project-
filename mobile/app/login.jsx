import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // Ajuste le chemin si nécessaire

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Langue - icône 🌐 */}
      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.languageIcon}>🌐</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.title}>
          <Text style={styles.stage}>Stage</Text>
          <Text style={styles.flow}>Flow</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t('email')}
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/tabs/home')}>
          <Text style={styles.buttonText}>{t('login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.link}>{t('forgot_password')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/register/step1')}>
        <Text style={{ textAlign: 'center', marginTop: 30 }}>
          <Text style={styles.blueText}>{t('no_account')} </Text>
          <Text style={styles.orangeText}>{t('create_account')}</Text>
        </Text>
      </TouchableOpacity>

      {/* Modal de sélection de langue */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => changeLanguage('fr')}>
                  <Text style={styles.languageOption}>🇫🇷 Français</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('en')}>
                  <Text style={styles.languageOption}>🇬🇧 English</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('ar')}>
                  <Text style={styles.languageOption}>🇩🇿 العربية</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  stage: {
    color: '#000041',
  },
  flow: {
    color: '#ff7b00',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#000041',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color: '#000041',
    textAlign: 'center',
    marginTop: 15,
  },
  blueText: {
    color: '#000041',
  },
  orangeText: {
    color: '#ff7b00',
    fontWeight: 'bold',
  },
  languageContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10, // Ensure it stays on top
  },
  languageIcon: {
    fontSize: 22,
    color: '#000041',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    minWidth: 200,
    elevation: 5,
  },
  languageOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center',
  },
});

