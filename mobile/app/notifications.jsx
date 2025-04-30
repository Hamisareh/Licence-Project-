import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const notifications = [
  { id: '1', title: 'Nouvelle offre de stage disponible !', time: 'Il y a 1 heure' },
  { id: '2', title: 'Votre candidature a été acceptée ✅', time: 'Hier' },
  { id: '3', title: 'Rappel : entretien demain à 10h', time: 'Il y a 2 jours' },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications 🔔</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000041',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});
