import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const handleSubmit = () => {
    Alert.alert('Mot de passe changé avec succès (simulation)');
  };

  return (
    <View style={styles.container}>
      {/* Header avec fond coloré et flèche */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')}>
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Changer le mot de passe</Text>
        <View style={{ width: 24 }} /> {/* Espace pour équilibrer la flèche */}
      </View>

      {/* Formulaire de changement de mot de passe */}
      <View style={styles.form}>
        <TextInput placeholder="Ancien mot de passe" secureTextEntry style={styles.input} />
        <TextInput placeholder="Nouveau mot de passe" secureTextEntry style={styles.input} />
        <TextInput placeholder="Confirmer le mot de passe" secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Valider</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTitle: {
    color: '#000041',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  form: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000041',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
