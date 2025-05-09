import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl // Import manquant ajouté ici
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const router = useRouter();
  const [offres, setOffres] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const api_URL = 'http://192.168.246.20:5000/api/auth';

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const [offresRes, favorisRes] = await Promise.all([
        axios.get(`${api_URL}/offres`),
        axios.get(`${api_URL}/favoris`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOffres(offresRes.data);
      setFavoris(favorisRes.data.map(f => f.id_offre));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleFavori = async (offre) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const isFavori = favoris.includes(offre.id_offre);
      
      // Utilisez le même endpoint que la version 1 qui marche
      const response = await axios.post(
        `${api_URL}/favoris/toggle`,
        { offre_fav: offre.id_offre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Mettez à jour l'état en fonction de la réponse
      if (response.data.action === 'added') {
        setFavoris([...favoris, offre.id_offre]);
      } else {
        setFavoris(favoris.filter(id => id !== offre.id_offre));
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
    }
  };

  const handlePress = (offre) => {
    router.push({
      pathname: '/offer-details',
      params: {
        id: offre.id_offre.toString() // On ne passe que l'ID
      }
    });
  };
  

  const filteredStages = offres.filter((stage) =>
    stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stage.entreprise_nom && stage.entreprise_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    stage.domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.appTitle}>
            <Text style={styles.stage}>Stage</Text>
            <Text style={styles.flow}>Flow</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Bell size={26} color="#ff7b00" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un stage..."
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <FlatList
        data={filteredStages}
        keyExtractor={(item) => item.id_offre.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8}>
              <Text style={styles.title}>{item.titre}</Text>
              <Text style={styles.entreprise}>Entreprise: {item.entreprise_nom || 'Non spécifiée'}</Text>
              <Text style={styles.domaine}>{item.domaine}</Text>
              <Text style={styles.duree}>Durée: {item.duree} mois</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleFavori(item)}
              style={styles.favoriteIcon}
            >
              <Heart
                size={24}
                color={favoris.includes(item.id_offre) ? 'red' : 'gray'}
                fill={favoris.includes(item.id_offre) ? 'red' : 'none'}
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000041']}
            tintColor="#000041"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune offre trouvée</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  stage: { color: '#fff' },
  flow: { color: '#ff7b00' },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: { fontSize: 16, color: '#333' },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    marginHorizontal: 5,
    position: 'relative',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000041' },
  entreprise: { fontSize: 14, color: '#555', marginBottom: 4 },
  domaine: { fontSize: 16, color: '#ff7b00', marginBottom: 2 },
  duree: { fontSize: 14, color: '#333' },
  favoriteIcon: { position: 'absolute', top: 15, right: 15 },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16
  }
});

export default HomeScreen;