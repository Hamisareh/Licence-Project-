import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native'; // ⚠️ Assure-toi que ce package est installé

const FavoritesScreen = () => {
  const [favoris, setFavoris] = useState([]);
  const router = useRouter();

  // Fonction pour charger les favoris
  const loadFavoris = async () => {
    try {
      const favorisData = await AsyncStorage.getItem('favoris');
      if (favorisData) {
        setFavoris(JSON.parse(favorisData));
      } else {
        setFavoris([]);
      }
    } catch (error) {
      console.error('Erreur chargement favoris', error);
    }
  };

  // Recharge les favoris à chaque fois que l’écran est focus
  useFocusEffect(
    useCallback(() => {
      loadFavoris();
    }, [])
  );

  // Supprimer un favori
  const removeFromFavoris = async (id) => {
    const updated = favoris.filter((item) => item.id !== id);
    setFavoris(updated);
    await AsyncStorage.setItem('favoris', JSON.stringify(updated));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/offer-details', params: item })}
    >
      <Text style={styles.title}>{item.titre}</Text>
      <Text style={styles.company}>{item.entr}</Text>
      <Text style={styles.details}>
        {item.duree} • {item.domaine}
      </Text>

      {/* Bouton pour retirer des favoris */}
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => removeFromFavoris(item.id)}
      >
        <Heart size={24} color="red" fill="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec flèche de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')}>
          <ArrowLeft size={26} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mes Favoris</Text>
        <View style={{ width: 26 }} /> {/* espace équilibré */}
      </View>

      {/* Liste des favoris */}
      <FlatList
        data={favoris}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            Aucun favori enregistré.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    gap :8
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000041',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
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

export default FavoritesScreen;
