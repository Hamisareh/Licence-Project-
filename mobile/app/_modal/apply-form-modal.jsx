import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

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

  const api_URL = 'http://192.168.246.20:5000/api/auth';

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
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
  
        const file = {
          uri: asset.uri,
          name: asset.name ?? 'cv.pdf',
          type: asset.mimeType ?? 'application/pdf',
          size: asset.size ?? 0
        };
  
        console.log("📄 Fichier sélectionné :", file);
  
        setFormData(prev => ({
          ...prev,
          cv: file
        }));
      } else {
        console.log("❌ Sélection annulée");
      }
    } catch (error) {
      console.error("Erreur sélection CV :", error);
      Alert.alert("Erreur", error.message || "Erreur lors de la sélection du fichier");
    }
  };
  
  const handleSubmit = async () => {
    try {
      console.log("Données du CV :", formData.cv);
      if (!formData?.cv?.uri) {
        Alert.alert('Erreur', 'Aucun CV sélectionné');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');

      const formPayload = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'cv' && formData[key]) {
          formPayload.append(key, formData[key]);
        }
      });
      console.log("🧾 Données du CV au submit :", formData.cv);

      if (formData.cv) {
        formPayload.append('cv', {
          uri: formData.cv.uri,
          name: formData.cv.name,
          type: formData.cv.type
        });
      }

      formPayload.append('offre_id', offre.id_offre);

      const response = await fetch(`${api_URL}/candidatures`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formPayload
      });

      if (!response.ok) throw new Error('Erreur lors de l’envoi');

      Alert.alert('Succès', 'Candidature envoyée !');
      onClose();

    } catch (error) {
      console.error("Erreur d'envoi :", error);
      Alert.alert('Erreur', error.message || 'Échec de l’envoi');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
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
            editable={field !== 'email'}
          />
        ))}

        <TouchableOpacity onPress={pickCV} style={styles.cvButton}>
          <Text style={styles.cvButtonText}>
            {formData.cv ? `✅ CV prêt: ${formData.cv.name}` : '📄 Choisir un CV (PDF)'}
          </Text>
          {formData.cv && (
            <Text style={styles.fileInfo}>
              {Math.round(formData.cv.size / 1024)} KB
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button title="Envoyer la candidature" onPress={handleSubmit} color="#000041" />
          <Button title="Annuler" onPress={onClose} color="#888" />
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
  fileInfo: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    gap: 10,
  },
});

export default ApplyFormModal;
