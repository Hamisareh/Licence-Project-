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
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplyFormModal from '../app/_modal/apply-form-modal';

const OffreDetails = () => {
  const { id } = useLocalSearchParams();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const api_URL = 'http://192.168.251.20:5000/api/auth';

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
    const user = await fetchUserData();
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour postuler');
      return;
    }
    if (user.role !== 'etudiant') {
      Alert.alert('Erreur', 'Seuls les étudiants peuvent postuler');
      return;
    }
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (formData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formPayload = new FormData();
      
      // Ajouter les données du formulaire
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
      setShowApplyModal(false);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi');
    }
  };

  if (loading || !offre) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>{offre.titre}</Text>
        <Text style={styles.company}>{offre.entreprise_nom}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Domaine</Text>
          <Text style={styles.text}>{offre.domaine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durée</Text>
          <Text style={styles.text}>{offre.duree} mois</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de début</Text>
          <Text style={styles.text}>{new Date(offre.date_debut).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de fin</Text>
          <Text style={styles.text}>{new Date(offre.date_fin).toLocaleDateString()}</Text>
        </View>

        {offre.entreprise_adr && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse</Text>
            <Text style={styles.text}>{offre.entreprise_adr}</Text>
          </View>
        )}

        {offre.missions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Missions</Text>
            <Text style={styles.text}>{offre.missions}</Text>
          </View>
        )}

        {offre.descr && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>{offre.descr}</Text>
          </View>
        )}

        {offre.competencesRequises && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences requises</Text>
            <Text style={styles.text}>{offre.competencesRequises}</Text>
          </View>
        )}

        {offre.entreprise_email && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.text}>Email: {offre.entreprise_email}</Text>
            {offre.entreprise_tel && (
              <Text style={styles.text}>Téléphone: {offre.entreprise_tel}</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApplyPress}
        >
          <Text style={styles.applyButtonText}>Postuler</Text>
        </TouchableOpacity>
      </View>

      <ApplyFormModal
        visible={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        offre={offre}
        userData={userData}
        onSubmit={handleSubmitApplication}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80 // Espace pour le bouton
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  company: { 
    fontSize: 18, 
    color: '#ff7b00', 
    marginBottom: 20 
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 5 
  },
  text: { 
    fontSize: 16 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  applyButton: {
    backgroundColor: '#000041',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default OffreDetails;