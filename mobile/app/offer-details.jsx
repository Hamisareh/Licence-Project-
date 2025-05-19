import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplyFormModal from '../app/_modal/apply-form-modal';
import * as DocumentPicker from 'expo-document-picker';

const OffreDetails = () => {
  const { id, from, etat } = useLocalSearchParams();
  const router = useRouter();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const api_URL = 'http://192.168.90.20:5000/api/auth';

  const getBackPath = () => {
    switch(from) {
      case 'mes-candidatures': return '/tabs/mes-candidatures';
      case 'mes-stages': return '/tabs/mes-stages';
      default: return '/tabs/home';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offreRes, userRes] = await Promise.all([
          axios.get(`${api_URL}/offres/${id}`),
          fetchUserData()
        ]);
        setOffre(offreRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      return null;
    }
  };

  const handleApplyPress = async () => {
    try {
      const user = await fetchUserData();
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour postuler');
        return;
      }
      if (user.role !== 'etudiant') {
        Alert.alert('Erreur', 'Seuls les étudiants peuvent postuler');
        return;
      }
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/candidatures/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.enStage) {
        Alert.alert('Erreur', 'Vous êtes déjà en stage, vous ne pouvez pas postuler');
        return;
      }
      setShowApplyModal(true);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de la vérification');
    }
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('rapport', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType
      });
      formData.append('stageId', id);
      const response = await axios.post(`${api_URL}/rapports`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        Alert.alert('Succès', response.data.message);
        setFile(null);
      }
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de l\'envoi');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !offre) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  const showApplyButton = !['mes-candidatures', 'mes-stages'].includes(from);
  const showUploadButton = from === 'mes-stages' && etat === 'en cours';

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.push(getBackPath())}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'offre</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Titre et Entreprise */}
        <Text style={styles.title}>{offre.titre}</Text>
        <View style={styles.companyContainer}>
          <Ionicons name="business" size={18} color="#ff7b00" />
          <Text style={styles.company}>{offre.entreprise_nom}</Text>
        </View>

        {/* Carte d'informations principales */}
        <View style={styles.infoCard}>
          {/* Adresse bien visible */}
          {offre.entreprise_adr && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color="#000041" style={styles.infoIcon}/>
              <Text style={styles.infoText}>{offre.entreprise_adr}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color="#000041" style={styles.infoIcon}/>
            <Text style={styles.infoText}>{offre.duree} mois</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={18} color="#000041" style={styles.infoIcon}/>
            <Text style={styles.infoText}>
              Du {new Date(offre.date_debut).toLocaleDateString()} au {new Date(offre.date_fin).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={18} color="#000041" style={styles.infoIcon}/>
            <Text style={styles.infoText}>{offre.domaine}</Text>
          </View>
        </View>

        {/* Missions */}
        {offre.missions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Missions</Text>
            <Text style={styles.text}>{offre.missions}</Text>
          </View>
        )}

        {/* Description */}
        {offre.descr && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>{offre.descr}</Text>
          </View>
        )}

        {/* Compétences */}
        {offre.competencesRequises && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences requises</Text>
            <Text style={styles.text}>{offre.competencesRequises}</Text>
          </View>
        )}

        {/* Contact */}
        {offre.entreprise_email && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={18} color="#ff7b00" />
              <Text style={styles.contactText}>{offre.entreprise_email}</Text>
            </View>
            {offre.entreprise_tel && (
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={18} color="#ff7b00" />
                <Text style={styles.contactText}>{offre.entreprise_tel}</Text>
              </View>
            )}
          </View>
        )}

        {/* Upload de rapport */}
        {showUploadButton && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Envoyer un rapport</Text>
            <TouchableOpacity
              onPress={selectFile}
              style={styles.selectButton}
            >
              <Text style={styles.buttonText}>
                {file ? file.name : 'Sélectionner un fichier (PDF/DOCX)'}
              </Text>
            </TouchableOpacity>
            {file && (
              <TouchableOpacity
                onPress={uploadFile}
                disabled={uploading}
                style={[styles.uploadButton, uploading && styles.disabledButton]}
              >
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Envoi en cours...' : 'Envoyer le rapport'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bouton Postuler */}
      {showApplyButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplyPress}
          >
            <Text style={styles.applyButtonText}>Postuler</Text>
          </TouchableOpacity>
        </View>
      )}

      <ApplyFormModal
        visible={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        offre={offre}
        userData={userData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backButton: {
    marginRight: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000041'
  },
  scrollContainer: {
    flex: 1
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 80
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 5
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  company: {
    fontSize: 16,
    color: '#ff7b00',
    marginLeft: 8
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoIcon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center'
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000041',
    marginBottom: 8
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444'
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  contactText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14
  },
  selectButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonText: {
    color: '#333',
    textAlign: 'center'
  },
  uploadButton: {
    backgroundColor: '#000041',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15
  },
  applyButton: {
    backgroundColor: '#000041',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default OffreDetails;