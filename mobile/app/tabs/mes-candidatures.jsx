import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';

const MesCandidatures = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filtreVisible, setFiltreVisible] = useState(false);
  const [etatFiltre, setEtatFiltre] = useState('');

  const candidatures = [
    {
      id: '1',
      titre: 'Stage Développement Web',
      entreprise: 'Google',
      domaine: 'Informatique',
      duree: '3 mois',
      etat: 'en attente',
    },
    {
      id: '2',
      titre: 'Stage Marketing Digital',
      entreprise: 'Facebook',
      domaine: 'Marketing',
      duree: '2 mois',
      etat: 'acceptée',
    },
    {
      id: '3',
      titre: 'Stage Design UI/UX',
      entreprise: 'Adobe',
      domaine: 'Design',
      duree: '1 mois',
      etat: 'refusée',
    },
  ];

  const filteredCandidatures = candidatures.filter((c) => {
    const matchSearch = c.titre.toLowerCase().includes(searchText.toLowerCase());
    const matchEtat = etatFiltre ? c.etat === etatFiltre : true;
    return matchSearch && matchEtat;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appName}>
            <Text style={styles.stageText}>Stage</Text>
            <Text style={styles.flowText}>Flow</Text>
          </Text>
          <TouchableOpacity onPress={() => setFiltreVisible(!filtreVisible)}>
            <Filter size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Rechercher une candidature..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            placeholderTextColor="#ccc"
          />
        </View>
      </View>

      {/* Filtres */}
      {filtreVisible && (
        <View style={styles.filtreContainer}>
          {['', 'en attente', 'acceptée', 'refusée'].map((etat) => (
            <TouchableOpacity
              key={etat}
              style={[
                styles.filtreButton,
                etat === etatFiltre && styles.filtreButtonActive,
              ]}
              onPress={() => setEtatFiltre(etat)}
            >
              <Text
                style={[
                  styles.filtreText,
                  etat === etatFiltre && { color: '#fff' },
                ]}
              >
                {etat || 'Tous'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Liste des candidatures */}
      <FlatList
        data={filteredCandidatures}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/offer-details',
                params: {
                  id: item.id,
                  titre: item.titre,
                  entreprise: item.entreprise,
                  domaine: item.domaine,
                  duree: item.duree,
                  showPostulerButton: 'false',
                },
              })
            }
          >
            <Text style={styles.titre}>{item.titre}</Text>
            <Text style={styles.entreprise}>{item.entreprise}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.tag}>{item.duree}</Text>
              <Text style={styles.tag}>{item.domaine}</Text>
              <Text
                style={[
                  styles.tag,
                  item.etat === 'en attente' && { backgroundColor: '#ffc10733' },
                  item.etat === 'acceptée' && { backgroundColor: '#28a74533' },
                  item.etat === 'refusée' && { backgroundColor: '#dc354533' },
                ]}
              >
                {item.etat}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MesCandidatures;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    backgroundColor: '#000041',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
     marginBottom: 25,
  },
  stageText: {
    color: '#fff',
  },
  flowText: {
    color: '#FF7B00',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
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
    backgroundColor: '#333',
    borderColor: '#333',
  },
  filtreText: {
    fontSize: 14,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  titre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 5,
  },
  entreprise: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FF6B00',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 13,
    color: '#333',
  },
});
