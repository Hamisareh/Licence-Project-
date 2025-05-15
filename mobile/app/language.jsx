import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function LanguageScreen() {
  const router = useRouter();

  const changeLanguage = (lang) => {
    // TODO : Ici tu dois connecter à ton système de traduction, par exemple i18n.changeLanguage(lang)
    console.log('Langue sélectionnée :', lang);
    router.back(); // Retour à la page précédente
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/tabs/profil')}>
  <ArrowLeft color="#000041" size={24} />
</TouchableOpacity>

        <Text style={styles.headerTitle}>Langue</Text>
        <View style={{ width: 24 }} /> {/* Pour équilibrer l’espace */}
      </View>

      {/* Contenu */}
      <View style={styles.options}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => changeLanguage('fr')}
        >
          <Text style={styles.languageText}>🇫🇷 Français</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => changeLanguage('en')}
        >
          <Text style={styles.languageText}>🇬🇧 English</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: 'white',
      paddingTop: 15,
    paddingBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      gap :8
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000041',
    },
    options: {
      padding: 30,
      gap: 20,
    },
    languageButton: {
      backgroundColor: '#f2f2f2',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    languageText: {
      fontSize: 18,
      color: '#000041',
      fontWeight: '500',
    },
  });
  