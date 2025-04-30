import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ApplyFormModal() {
  const router = useRouter();
  const { titre, entr } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    departement: '',
    specialite: '',
    universite: '',
    email: '',
    cv: null, // on stockera ici le fichier
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.type === 'success') {
      setFormData({ ...formData, cv: result });
    }
  };

  const handleSend = () => {
    console.log('Formulaire envoyé :', formData);
    // ici tu pourras envoyer le CV (result.uri) vers Supabase
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Candidature pour {titre} chez {entr}</Text>

      {['nom', 'niveau', 'departement', 'specialite', 'universite', 'email'].map((key) => (
        <TextInput
          key={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={formData[key]}
          onChangeText={(text) => handleChange(key, text)}
          style={styles.input}
        />
      ))}

      {/* Bouton pour choisir le CV */}
      <TouchableOpacity onPress={pickCV} style={styles.cvButton}>
        <Text style={styles.cvButtonText}>
          {formData.cv ? `CV sélectionné : ${formData.cv.name}` : 'Choisir un CV (PDF)'}
        </Text>
      </TouchableOpacity>

      <Button title="Envoyer" color="#000041" onPress={handleSend} />
      <View style={{ marginTop: 10 }}>
        <Button title="Annuler" color="#888" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000041',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  cvButton: {
    borderWidth: 1,
    borderColor: '#000041',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  cvButtonText: {
    color: '#000041',
    fontSize: 16,
    textAlign: 'center',
  },
});
