import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
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

  const api_URL = 'http://192.168.251.20:5000/api/auth';

  const fetchOffres = async () => {
    try {
      const response = await axios.get(`${api_URL}/offres`);
      setOffres(response.data);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    }
  };

  const fetchFavoris = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/favoris`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoris(response.data);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavori = async (offre) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${api_URL}/favoris/toggle`,
        { offre_fav: offre.id_offre },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.action === 'added') {
        setFavoris([...favoris, offre]);
      } else {
        setFavoris(favoris.filter(f => f.id_offre !== offre.id_offre));
      }
    } catch (error) {
      console.error('Erreur toggleFavori:', error);
      Alert.alert('Erreur', 'Action impossible');
    }
  };

  useEffect(() => {
    fetchOffres();
    fetchFavoris();
  }, []);

  const filteredStages = offres.filter((stage) =>
    stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stage.entreprise_nom && stage.entreprise_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
                color={favoris.some(f => f.id_offre === item.id_offre) ? 'red' : 'gray'}
                fill={favoris.some(f => f.id_offre === item.id_offre) ? 'red' : 'none'}
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
});

export default HomeScreen;
