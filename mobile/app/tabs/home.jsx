import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity
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

  const API_URL = 'http://192.168.251.20:5000/api/auth';

  const fetchOffres = async () => {
    try {
      const response = await axios.get(`${API_URL}/offres`);
      setOffres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des offres :', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoris = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token récupéré pour favoris:', token);

      const response = await axios.get(`${API_URL}/favoris`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Favoris reçus:', response.data);
      setFavoris(response.data); // ✅ mise à jour du state
    } catch (error) {
      console.error('Erreur chargement favoris :', error);
    }
  };

  useEffect(() => {
    fetchOffres();
    fetchFavoris();
  }, []);

  const toggleFavori = async (offre) => {
    try {
      const token = await AsyncStorage.getItem('token'); // ✅ corrigé ici

      const isFavori = favoris.includes(offre.id_offre);

      if (isFavori) {
        await axios.delete(`${API_URL}/favoris/${offre.id_offre}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoris(favoris.filter(id => id !== offre.id_offre));
      } else {
        await axios.post(`${API_URL}/favoris`, { offre_fav: offre.id_offre }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoris([...favoris, offre.id_offre]);
      }
    } catch (error) {
      console.error('Erreur ajout/suppression favori :', error);
    }
  };

  const filteredStages = offres.filter((stage) =>
    stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.entreprise_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePress = (offre) => {
    router.push({
      pathname: '../offre-details',
      params: { id_offre: offre.id_offre }
    });
  };

  if (loading) return <Text style={{ padding: 20 }}>Chargement...</Text>;

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

        <View style={{ height: 25 }} />
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
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Text style={styles.title}>{item.titre}</Text>
            <Text style={styles.entreprise}>Entreprise : {item.entreprise_nom}</Text>
            <Text style={styles.domaine}>{item.domaine}</Text>
            <Text style={styles.duree}>{item.duree}</Text>
            <TouchableOpacity onPress={() => toggleFavori(item)} style={styles.favoriteIcon}>
              <Heart
                size={24}
                color={favoris.includes(item.id_offre) ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#000041', paddingTop: 15, paddingHorizontal: 20,
    paddingBottom: 40, borderBottomRightRadius: 30, borderBottomLeftRadius: 30,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appTitle: { fontSize: 22, fontWeight: 'bold' },
  stage: { color: '#fff' },
  flow: { color: '#ff7b00' },
  searchContainer: {
    backgroundColor: '#fff', borderRadius: 15,
    paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#ccc',
  },
  searchInput: { fontSize: 16, color: '#333' },
  card: {
    backgroundColor: '#f9f9f9', borderRadius: 12,
    padding: 15, marginBottom: 15, elevation: 2, marginHorizontal: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000041' },
  entreprise: { fontSize: 14, color: '#555', marginBottom: 4 },
  domaine: { fontSize: 16, color: '#ff7b00', marginBottom: 2 },
  duree: { fontSize: 14, color: '#333' },
  favoriteIcon: { position: 'absolute', top: 15, right: 15 },
});

export default HomeScreen;
