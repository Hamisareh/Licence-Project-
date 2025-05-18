import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Filter, X } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MesCandidatures = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filtreVisible, setFiltreVisible] = useState(false);
  const [etatFiltre, setEtatFiltre] = useState('');
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.246.20:5000/api/auth';

const fetchCandidatures = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${api_URL}/candidatures`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      setCandidatures(response.data.data);
    }
  } catch (error) {
    console.error('Erreur:', error);
    Alert.alert('Erreur', 'Impossible de charger les candidatures');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCandidatures();
  };

  const annulerCandidature = async (idOffre) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${api_URL}/candidatures/${idOffre}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCandidatures(candidatures.filter(c => c.id !== idOffre));
      Alert.alert('Succès', 'Candidature annulée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de l\'annulation');
    }
  };

  const filteredCandidatures = candidatures.filter((c) => {
    const matchSearch = c.titre.toLowerCase().includes(searchText.toLowerCase());
    const matchEtat = etatFiltre ? c.etat === etatFiltre : true;
    return matchSearch && matchEtat;
  });

  const handlePress = (item) => {
   router.push({
    pathname: '/offer-details',
    params: {
      id: item.id.toString(),
      from: 'mes-candidatures' // Ajoutez cette ligne
    }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header style identique à home */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.appTitle}>
            <Text style={styles.stage}>Stage</Text>
            <Text style={styles.flow}>Flow</Text>
          </Text>
          <TouchableOpacity onPress={() => setFiltreVisible(!filtreVisible)}>
            <Filter size={24} color="#ff7b00" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une candidature..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {filtreVisible && (
        <View style={styles.filtreContainer}>
          {['', 'en_attente', 'accepte', 'refuse'].map((etat) => (
            <TouchableOpacity
              key={etat}
              style={[
                styles.filtreButton,
                etat === etatFiltre && styles.filtreButtonActive,
              ]}
              onPress={() => setEtatFiltre(etat)}
            >
              <Text style={[
                styles.filtreText,
                etat === etatFiltre && { color: '#fff' },
              ]}>
                {etat === '' ? 'Tous' : etat === 'en_attente' ? 'En attente' : etat === 'accepte' ? 'Acceptée' : 'Refusée'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredCandidatures}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000041']}
            tintColor="#000041"
          />
        }
        contentContainerStyle={{ padding: 20, paddingTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.card}
            activeOpacity={0.9}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.titre}</Text>
              {item.etat === 'en_attente' && (
                <TouchableOpacity
                  onPress={() => annulerCandidature(item.id)}
                  style={styles.annulerButton}
                >
                  <X size={18} color="#dc3545" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.entreprise}>Entreprise: {item.entreprise}</Text>
            <Text style={styles.domaine}>{item.details.domaine}</Text>
            <Text style={styles.duree}>periode: {item.details.periode}</Text>
            <Text
              style={[
                styles.tag,
                item.etat === 'en_attente' && { backgroundColor: '#ffc10733' },
                item.etat === 'accepte' && { backgroundColor: '#28a74533' },
                item.etat === 'refuse' && { backgroundColor: '#dc354533' },
              ]}
            >
              {item.etat === 'en_attente' ? 'En attente' : item.etat === 'accepte' ? 'Acceptée' : 'Refusée'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune candidature trouvée</Text>
        }
      />
    </View>
  );
};

export default MesCandidatures;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  header: {
    backgroundColor: '#000041',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  appTitle: { fontSize: 22, fontWeight: 'bold' },
  stage: { color: '#fff',fontSize:25 },
  flow: { color: '#ff7b00',fontSize:30 },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
       marginTop:30,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: { fontSize: 16, color: '#333' },
  filtreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  filtreButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filtreButtonActive: {
    backgroundColor:'#000041',
    borderColor: '#333',
  },
  filtreText: {
    fontSize: 14,
    color: '#000041',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    position: 'relative',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000041' },
  entreprise: { fontSize: 14, color: '#555', marginBottom: 4 },
  domaine: { fontSize: 16, color: '#ff7b00', marginBottom: 2 },
  duree: { fontSize: 14, color: '#333' },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: 'bold',
  },
  annulerButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16
  }
});