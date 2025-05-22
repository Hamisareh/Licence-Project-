import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const api_URL = 'http://192.168.90.20:5000/api/auth';

  useEffect(() => {
    // Récupérer les données de l'utilisateur
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${api_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        Alert.alert('Erreur', 'Impossible de charger les données du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Demander les permissions pour l'image
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImagePress = () => {
    Alert.alert(
      'Changer la photo de profil',
      'Choisir une option',
      [
        { text: 'Galerie', onPress: pickImage },
        { text: 'Caméra', onPress: takePhoto },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
 const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => router.push('/logout'),
        },
      ],
      { cancelable: true }
    );
  };
  const menuItems = [
    { label: 'Mes informations', icon: 'person-outline', path: '../profile-details' },
    { label: 'Mes favoris', icon: 'heart-outline', path: '../favoris' },
    { label: 'Changer le mot de passe', icon: 'key-outline', path: '/mdps' },
    { label: "Conditions d'utilisation", icon: 'document-outline', path: '/terms' },
    { label: 'Mes evaluation', icon: 'star-outline', path: '/evaluation' },
 { label: 'Se déconnecter', icon: 'exit-outline', onPress: handleLogout, danger: true }
  ];

  // Fonction pour traduire le rôle
  const getRoleLabel = (role) => {
    switch(role) {
      case 'etudiant': return 'Étudiant';
      case 'entreprise': return 'Entreprise';
      case 'admin': return 'Administrateur';
      case 'chef_dept': return 'Chef de département';
      default: return 'Utilisateur';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header fixe */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={
              image
                ? { uri: image }
                : require('../../assets/default-profile.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        
        {loading ? (
          <>
            <Text style={styles.name}>Chargement...</Text>
            <Text style={styles.status}>...</Text>
          </>
        ) : (
          <>
            <Text style={styles.name}>
              {userData?.prenom || ''} {userData?.nom || 'Utilisateur'}
            </Text>
            <Text style={styles.status}>
              {userData?.role ? getRoleLabel(userData.role) : 'Rôle inconnu'}
            </Text>
          </>
        )}
      </View>

      {/* Menu scrollable */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress || (() => router.push(item.path))}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={item.danger ? '#ff7b00' : '#000041'}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[
                styles.menuText,
                item.danger && { color: '#ff7b00' }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#000041',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#fff',
  },
  status: {
    fontSize: 16,
    color: '#ff7b00',
    marginBottom: 10,
  },
  menuContainer: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#000041',
  },
});