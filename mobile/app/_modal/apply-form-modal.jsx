import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const ApplyFormModal = ({ visible, onClose, offre, userData }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    niveau: '',
    departement: '',
    specialite: '',
    universite: '',
    email: '',
    cv: null,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        universite: userData.universite || '',
        specialite: userData.specialite || '',
        niveau: userData.niveau || '',
        departement: userData.departement || '',
        cv: null
      });
    }
  }, [userData]);

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

  const handleSubmit = async () => {
    try {
      // Envoyer les données au backend
      const token = await AsyncStorage.getItem('token');
      const formPayload = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'cv' && value) {
          formPayload.append(key, value);
        }
      });
      
      // Ajouter le CV si présent
      if (formData.cv) {
        formPayload.append('cv', {
          uri: formData.cv.uri,
          name: formData.cv.name,
          type: 'application/pdf'
        });
      }
      
      // Ajouter l'ID de l'offre
      formPayload.append('offre_id', offre.id_offre);

      const response = await axios.post(
        `${api_URL}/candidatures`,
        formPayload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('Succès', 'Votre candidature a été envoyée !');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          Postuler à {offre.titre} chez {offre.entreprise_nom}
        </Text>

        {['nom', 'prenom', 'email', 'universite', 'departement', 'specialite', 'niveau'].map((field) => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            editable={field !== 'email'} // Email non modifiable
          />
        ))}

        <TouchableOpacity onPress={pickCV} style={styles.cvButton}>
          <Text style={styles.cvButtonText}>
            {formData.cv ? `CV sélectionné: ${formData.cv.name}` : 'Choisir un CV (PDF)'}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title="Envoyer la candidature"
            onPress={handleSubmit}
            color="#000041"
          />
          <Button
            title="Annuler"
            onPress={onClose}
            color="#888"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000041',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  cvButton: {
    borderWidth: 1,
    borderColor: '#000041',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  cvButtonText: {
    color: '#000041',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default ApplyFormModal;