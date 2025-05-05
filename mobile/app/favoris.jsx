import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../utils/storage'; // Assure-toi que le chemin est correct

const Favoris = () => {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les favoris avec un token
  const fetchFavoris = async (token) => {
    try {
      const res = await fetch('http://192.168.251.20:5000/api/auth/favoris', {
        headers: {
          Authorization: `Bearer ${token}` // Ajout du token dans l'en-tête
        },
      });
      const data = await res.json();
      setFavoris(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      setLoading(false);
    }
  };

  // Fonction pour supprimer un favori avec un token
  const removeFavori = async (offreId, token) => {
    try {
      await fetch('http://192.168.251.20:5000/api/auth/favoris', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Ajout du token dans l'en-tête
        },
        body: JSON.stringify({ offreId })
      });
      // Mise à jour des favoris après suppression
      setFavoris(favoris.filter(o => o.id_offre !== offreId));
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
    }
  };

  // Récupérer le token et charger les favoris
  const loadFavoris = async () => {
    const token = await getToken(); // Récupérer le token depuis AsyncStorage
    if (token) {
      fetchFavoris(token); // Charger les favoris avec le token
    } else {
      console.log('Token introuvable');
    }
  };

  // Charger les favoris au démarrage du composant
  useEffect(() => {
    loadFavoris();
  }, []);

  // Afficher un indicateur de chargement si nécessaire
  if (loading) return <ActivityIndicator size="large" color="red" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favoris}
        keyExtractor={(item) => item.id_offre.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.titre}</Text>
            <Text style={styles.company}>{item.entreprise_nom}</Text>
            <Text style={styles.details}>{item.domaine} • {item.duree} mois</Text>
            <TouchableOpacity style={styles.favoriteIcon} onPress={() => removeFavori(item.id_offre)}>
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    marginHorizontal: 5,
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
