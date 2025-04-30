import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const InfoRow = ({ label, value, icon, onEdit }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color="#000041" style={styles.icon} />
    <View style={styles.info}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
    {onEdit && (
      <TouchableOpacity onPress={onEdit}>
        <Ionicons name="pencil-outline" size={20} color="#000041" />
      </TouchableOpacity>
    )}
  </View>
);

export default function MesInformationsScreen({ isOwner = true }) {
  const router = useRouter();

  const [infos, setInfos] = useState({
    nom: 'Benali',
    prenom: 'Sofiane',
    email: 'sofiane@ex.com',
    universite: 'Université d’Oran',
    specialite: 'Informatique',
    matricule: '20215487',
    niveau: 'Master 1',
    departement: 'Math-Info',
  });

  const [selectedKey, setSelectedKey] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  const openEditModal = (key) => {
    setSelectedKey(key);
    setEditedValue(infos[key]);
  };

  const saveEdit = () => {
    setInfos({ ...infos, [selectedKey]: editedValue });
    setSelectedKey(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs/profil')}>
          <Ionicons name="arrow-back-outline" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Informations</Text>
      </View>

      {/* Infos */}
      <View style={styles.content}>
        <InfoRow label="Nom" value={infos.nom} icon="person-outline" onEdit={isOwner ? () => openEditModal('nom') : null} />
        <InfoRow label="Prénom" value={infos.prenom} icon="person-outline" onEdit={isOwner ? () => openEditModal('prenom') : null} />
        <InfoRow label="Email" value={infos.email} icon="mail-outline" onEdit={isOwner ? () => openEditModal('email') : null} />
        <InfoRow label="Université" value={infos.universite} icon="school-outline" onEdit={isOwner ? () => openEditModal('universite') : null} />
        <InfoRow label="Spécialité" value={infos.specialite} icon="flask-outline" onEdit={isOwner ? () => openEditModal('specialite') : null} />
        <InfoRow label="Niveau" value={infos.niveau} icon="book-outline" onEdit={isOwner ? () => openEditModal('niveau') : null} />
        <InfoRow label="Département" value={infos.departement} icon="business-outline" onEdit={isOwner ? () => openEditModal('departement') : null} />

        {/* Visible only to owner */}
        {isOwner && (
          <InfoRow label="Matricule" value={infos.matricule} icon="card-outline" onEdit={() => openEditModal('matricule')} />
        )}
      </View>

      {/* Modal d'édition */}
      <Modal visible={selectedKey !== null} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Modifier</Text>
            <TextInput
              style={styles.input}
              value={editedValue}
              onChangeText={setEditedValue}
              placeholder="Nouvelle valeur"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={saveEdit} style={styles.button}>
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedKey(null)} style={[styles.button, { backgroundColor: '#ccc' }]}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 10,
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
  headerTitle: {
    color: '#000041',
    fontSize: 20,
    fontWeight: 'bold',

  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f1f1fa',
    marginBottom: 10,
    borderRadius: 22,
  },
  icon: {
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
    paddingHorizontal: 30,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000041',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#000041',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
});
