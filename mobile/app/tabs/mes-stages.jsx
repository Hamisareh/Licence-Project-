import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, ChevronRight } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const MesStages = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filtreVisible, setFiltreVisible] = useState(false);
  const [etatFiltre, setEtatFiltre] = useState('');
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.90.20:5000/api/auth';

 const fetchStages = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${api_URL}/etudiant/stages`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      // On récupère tous les stages sans filtrer par validation_chef
      setStages(response.data.data);
    }
  } catch (error) {
    console.error('Erreur:', error);
    Alert.alert('Erreur', 'Impossible de charger les stages');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

useEffect(() => {
  fetchStages();
}, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStages();
  };

  const stagesFiltres = stages.filter((stage) => {
    const matchSearch = stage.titre.toLowerCase().includes(searchText.toLowerCase());
    const matchEtat = etatFiltre ? stage.etat === etatFiltre : true;
    return matchSearch && matchEtat;
  });

  const getEtatColor = (etat) => {
    switch(etat) {
      case 'en cours': return '#28a74533';
      case 'terminé': return '#6c757d';
      case 'abandonné': return '#dc3545';
      default: return '#000041';
    }
  }




  return (
    <View style={styles.container}>
      {/* Header */}
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
            placeholder="Rechercher un stage..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filtres */}
      {filtreVisible && (
        <View style={styles.filtreContainer}>
          {['', 'en cours', 'terminé', 'abandonné'].map((etat) => (
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
                {etat === '' ? 'Tous' : etat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Liste des stages */}
      <FlatList
        data={stagesFiltres}
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
          <View>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/offer-details',
                params: { 
                  id: item.id.toString(),
                  from: 'mes-stages',
                  etat: item.etat
                }
              })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.titre}</Text>
                <ChevronRight size={20} color="#666" />
              </View>
              <Text style={styles.entreprise}>Entreprise: {item.entreprise}</Text>
              <Text style={styles.domaine}>{item.domaine}</Text>
              
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>periode: {item.details?.periode }</Text>
              </View>

              <View style={[styles.etatBadge, { backgroundColor: getEtatColor(item.etat) }]}>
                <Text style={styles.etatText}>{item.etat.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
    
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {stages.length === 0 ? 'Aucun stage trouvé' : 'Aucun résultat pour cette recherche'}
          </Text>
        }
      />
    </View>
  );
};

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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000041' },
  entreprise: { fontSize: 14, color: '#555', marginBottom: 4 },
  domaine: { fontSize: 16, color: '#ff7b00', marginBottom: 2 },
  detailText: { fontSize: 14, color: '#333' },
  etatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop:5,
    alignSelf: 'flex-start',
  },
  etatText: {
    color: '',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16
  }
});

export default MesStages;