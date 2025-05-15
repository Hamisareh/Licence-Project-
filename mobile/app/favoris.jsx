import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Favoris = () => {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const api_URL = 'http://192.168.246.20:5000/api/auth';

  const fetchFavoris = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/favoris`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoris(response.data);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger les favoris');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavori = async (offreId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${api_URL}/favoris/toggle`,
        { offre_fav: offreId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.action === 'removed') {
        setFavoris(favoris.filter(o => o.id_offre !== offreId));
      }
    } catch (err) {
      Alert.alert('Erreur', 'Action impossible');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* En-tête avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes favoris</Text>
      </View>

      {favoris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Aucun favori enregistré</Text>
        </View>
      ) : (
        <FlatList
          data={favoris}
          keyExtractor={(item) => item.id_offre.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.titre}</Text>
              <Text style={styles.company}>{item.entreprise_nom}</Text>
              <Text style={styles.details}>{item.domaine} • {item.duree} mois</Text>
              <TouchableOpacity 
                style={styles.favoriteIcon} 
                onPress={() => toggleFavori(item.id_offre)}
              >
                <Ionicons name="heart-outline" size={24} color="#ff7b00" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    marginHorizontal: 5,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
  },
  company: {
    fontSize: 16,
    color: '#ff7b00',
    marginVertical: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

export default Favoris;