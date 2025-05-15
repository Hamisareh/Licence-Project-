import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EvaluationCard = ({ evalData }) => (
  <View style={styles.card}>
    <Text style={styles.header}>{evalData.nom_entreprise}</Text>
    <Text style={styles.offerTitle}>{evalData.titre_offre}</Text>
    <Text style={styles.subtitle}>Soumis le : {new Date(evalData.date_soumission).toLocaleDateString()}</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Comportement :</Text>
      <Text style={styles.note}>{evalData.note_comport}/20</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Adaptabilité :</Text>
      <Text style={styles.note}>{evalData.note_adapt}/20</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Travail d'équipe :</Text>
      <Text style={styles.note}>{evalData.note_esprit_equipe}/20</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Qualité du travail :</Text>
      <Text style={styles.note}>{evalData.note_qual_trav}/20</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Absences :</Text>
      <Text style={styles.value}>{evalData.nb_absences}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Justifiées :</Text>
      <Text style={styles.value}>{evalData.nb_justification}</Text>
    </View>

    <Text style={styles.commentTitle}>Commentaire :</Text>
    <Text style={styles.comment}>{evalData.commentaire}</Text>
  </View>
);

const EvaluationScreen = () => {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.100.30:5000/api/auth';

  const fetchEvaluations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/etudiant/evaluations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEvaluations(response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvaluations();
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.push('/tabs/profil')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.title}>Évaluations de stage</Text>
      </View>
      
      <FlatList
        data={evaluations}
        keyExtractor={item => `${item.evaluateur}-${item.id_offre}`}
        renderItem={({ item }) => <EvaluationCard evalData={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#000041']}
            tintColor="#000041"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune évaluation disponible</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000041',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
  },
  offerTitle: {
    fontSize: 16,
    color: '#ff7b00',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 160,
    fontWeight: '600',
    color: '#000041',
  },
  value: {
    color: '#000041',
  },
  note: {
    color: '#ff7b00',
    fontWeight: 'bold',
  },
  commentTitle: {
    marginTop: 10,
    fontWeight: '600',
    color: '#000041',
  },
  comment: {
    fontStyle: 'italic',
    color: '#333',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20
  }
});

export default EvaluationScreen;