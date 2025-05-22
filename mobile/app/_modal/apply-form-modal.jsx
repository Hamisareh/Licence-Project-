import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApplyFormModal = ({ visible, onClose, offre, userData }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    niveau: '',
    departement: '',
    specialite: '',
    universite: '',
    email: '',
    cv: null,
  });
  const [loading, setLoading] = useState(false);
  const api_URL = 'http://192.168.90.20:5000/api/auth';

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
         matricule: userData.matricule || '',
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
        copyToCacheDirectory: true
      });
  
      if (!result.canceled && result.assets?.[0]) {
        setFormData({
          ...formData,
          cv: {
            uri: result.assets[0].uri,
            name: result.assets[0].name || 'cv.pdf',
            type: result.assets[0].mimeType || 'application/pdf'
          }
        });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner le fichier");
    }
  };

  const handleSubmit = async () => {
    if (!formData.cv) {
      Alert.alert('Erreur', 'Veuillez sélectionner un CV');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'cv') formPayload.append(key, value);
      });

      formPayload.append('cv', {
        uri: formData.cv.uri,
        name: formData.cv.name,
        type: formData.cv.type
      });
      formPayload.append('offre_id', offre.id_offre);

      const response = await axios.post(`${api_URL}/candidatures`, formPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      Alert.alert('Succès', 'Votre candidature a été envoyée !');
      onClose();
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ff7b00" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>
              Postuler chez <Text style={styles.companyName}>{offre.entreprise_nom}</Text>
            </Text>
            <Text style={styles.offerTitle}>{offre.titre}</Text>

            <View style={styles.formGroup}>
       
            {['nom', 'prenom', 'email'].map((field) => (
  <TextInput
    key={field}
    style={[styles.input, styles.readOnlyInput]}
    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    value={formData[field]}
    editable={false}
  />
))}
            </View>

            <View style={styles.formGroup}>
             
            {['universite', 'departement', 'specialite', 'niveau', 'matricule'].map((field) => (
  <TextInput
    key={field}
    style={[styles.input, styles.readOnlyInput]}
    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    value={formData[field]}
    editable={false}
  />
))}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Votre CV (PDF)</Text>
              <TouchableOpacity 
                onPress={pickCV} 
                style={[
                  styles.cvButton,
                  formData.cv && styles.cvButtonSelected
                ]}
              >
                <Ionicons 
                  name="document-attach" 
                  size={20} 
                  color={formData.cv ? "#fff" : "#ff7b00"} 
                />
                <Text style={[
                  styles.cvButtonText,
                  formData.cv && styles.cvButtonTextSelected
                ]}>
                  {formData.cv ? formData.cv.name : 'Sélectionner un fichier'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit} 
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="white" />
                  <Text style={styles.submitButtonText}>Envoyer ma candidature</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000041',
    textAlign: 'center',
    marginBottom: 5,
  },
  companyName: {
    color: '#ff7b00',
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000041',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff7b00',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'transparent',
  },
  cvButtonSelected: {
    backgroundColor: '#ff7b00',
    borderColor: '#ff7b00',
  },
  cvButtonText: {
    marginLeft: 10,
    color: '#ff7b00',
    fontSize: 15,
  },
  cvButtonTextSelected: {
    color: 'white',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000041',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ApplyFormModal;