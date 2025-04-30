import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [image, setImage] = useState(null);

  useEffect(() => {
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

  const menuItems = [
    { label: 'Mes informations', icon: 'person-outline', path: '/profile-details' },
    { label: 'Mes favoris', icon: 'heart-outline', path: '/favorites' },
    { label: 'Mes documents', icon: 'document-text-outline', path: '/documents' },
    { label: 'Changer le mot de passe', icon: 'key-outline', path: '/change-password' },
    { label: 'Changer la langue', icon: 'language-outline', path: '/language' },
    { label: "Conditions d'utilisation", icon: 'document-outline', path: '/terms' },
    { label: 'Aide', icon: 'help-circle-outline', path: '/help' },
    { label: 'Se déconnecter', icon: 'log-out-outline', path: '/logout', danger: true },
  ];

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
        <Text style={styles.name}>Nom de l’utilisateur</Text>
        <Text style={styles.status}>Étudiant</Text>
      </View>

      {/* Menu scrollable */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.path)}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={item.danger ? 'red' : '#000041'}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[
                styles.menuText,
                item.danger && { color: 'red' }
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
    color: '#ccc',
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
    backgroundColor: '#f0f0f8',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#000041',
  },
});
