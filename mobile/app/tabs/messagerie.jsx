import { useRouter } from 'expo-router';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';

const entreprises = [
  { id: '1', nom: 'Google', lastMessageDate: '2025-04-19T14:32:00' },
  { id: '2', nom: 'Amazon', lastMessageDate: '2025-04-18T09:15:00' },
  { id: '3', nom: 'Microsoft', lastMessageDate: '2025-04-17T16:45:00' },
];

const formatHeure = (isoDate) => {
  const date = new Date(isoDate);
  const heures = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${heures}:${minutes}`;
};

export default function MessagerieList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messagerie</Text>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={entreprises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entrepriseItem}
            onPress={() => router.push(`/messagerie/${item.id}`)}
          >
            <View style={styles.row}>
              <Text style={styles.nom}>{item.nom}</Text>
              <Text style={styles.date}>{formatHeure(item.lastMessageDate)}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000041',
    paddingTop:  15,
    paddingBottom: 16,
    paddingHorizontal: 10,
   borderBottomRightRadius:15,
   borderBottomLeftRadius:15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  entrepriseItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
});
