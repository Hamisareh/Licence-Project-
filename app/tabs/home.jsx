import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const router = useRouter();
  const [favoris, setFavoris] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 état pour la recherche

  const fakeStages = [
    {
      id: '1',
      entr: 'OpenAI',
      titre: 'Développeur Mobile',
      domaine: 'Informatique',
      duree: '3 mois',
      date_debut: '2025-06-01',
      date_fin: '2025-08-31',
      missions: 'Développement d’une application mobile avec React Native.',
      descr: 'Stage très formateur au sein d’une équipe dynamique.',
      competencesRequises: 'React Native, JavaScript, API REST',
    },
    {
      id: '2',
      entr: 'Google',
      titre: 'UI/UX Designer',
      domaine: 'Design',
      duree: '2 mois',
      date_debut: '2025-07-01',
      date_fin: '2025-08-31',
      missions: 'Création de maquettes et prototypage.',
      descr: 'Environnement de travail stimulant.',
      competencesRequises: 'Figma, Design Thinking',
    },
  ];

  const saveFavoris = async (favoris) => {
    try {
      await AsyncStorage.setItem('favoris', JSON.stringify(favoris));
    } catch (error) {
      console.error('Erreur de sauvegarde des favoris :', error);
    }
  };

  const loadFavoris = async () => {
    try {
      const favorisData = await AsyncStorage.getItem('favoris');
      if (favorisData) {
        setFavoris(JSON.parse(favorisData));
      }
    } catch (error) {
      console.error('Erreur de chargement des favoris :', error);
    }
  };

  const toggleFavori = (offre) => {
    setFavoris((prev) => {
      const existe = prev.find((item) => item.id === offre.id);
      const updated = existe
        ? prev.filter((item) => item.id !== offre.id)
        : [...prev, offre];
      saveFavoris(updated);
      return updated;
    });
  };

  useEffect(() => {
    loadFavoris();
  }, []);

  const handlePress = (stage) => {
    router.push({
      pathname: '/offer-details',
      params: stage,
    });
  };

  // 🔍 Filtrage des stages
  const filteredStages = fakeStages.filter((stage) =>
    stage.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.entr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stage.domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
      </View>

      <FlatList
        data={filteredStages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.title}>{item.titre}</Text>
            <Text style={styles.company}>{item.entr}</Text>
            <Text style={styles.details}>
              {item.duree} • {item.domaine}
            </Text>

            <TouchableOpacity
              onPress={() => toggleFavori(item)}
              style={styles.favoriteIcon}
            >
              <Heart
                size={24}
                color={favoris.find((f) => f.id === item.id) ? 'red' : 'gray'}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  stage: {
    color: '#fff',
  },
  flow: {
    color: '#ff7b00',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
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

export default HomeScreen;
