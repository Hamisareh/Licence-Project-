import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DocumentsScreen() {
  const router = useRouter();

  const documents = [
    { id: '1', nom: 'Convention de stage.pdf', type: 'PDF', date: '12/03/2024' },
    { id: '2', nom: 'Lettre de motivation.docx', type: 'DOCX', date: '10/03/2024' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')} style={styles.backButtonInline}>
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Documents</Text>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.docName}>{item.nom}</Text>
            <Text style={styles.docInfo}>Type: {item.type} | Date: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: -25,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backButtonInline: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000041',
  },
  card: {
    backgroundColor: '#f0f0f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  docName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  docInfo: {
    color: '#555',
    marginTop: 5,
  },
});
