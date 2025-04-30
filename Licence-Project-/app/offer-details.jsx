import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function OfferDetails() {
  const {
    entr,
    titre,
    domaine,
    duree,
    date_debut,
    date_fin,
    missions,
    descr,
    competencesRequises,
    showPostulerButton,
  } = useLocalSearchParams();

  const router = useRouter();
  const afficherPostuler = showPostulerButton !== 'false';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header personnalisé */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Détails</Text>
        <View style={{ width: 28 }} /> {/* Pour équilibrer avec la flèche */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{titre}</Text>
        <Text style={styles.company}>{entr}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Domaine:</Text>
          <Text style={styles.value}>{domaine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Durée:</Text>
          <Text style={styles.value}>{duree}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Période:</Text>
          <Text style={styles.value}>
            {date_debut} → {date_fin}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Missions:</Text>
          <Text style={styles.value}>{missions}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{descr}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Compétences requises:</Text>
          <Text style={styles.value}>{competencesRequises}</Text>
        </View>

        {/* Bouton Postuler conditionnel */}
        {afficherPostuler && (
          <View style={{ marginTop: 20 }}>
            <Button
              title="Postuler"
              color="#000041"
              onPress={() =>
                router.push({
                  pathname: '_modal/apply-form-modal',
                  params: { titre, entr },
                })
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000041',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 5,
  },
  company: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff7b00',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
