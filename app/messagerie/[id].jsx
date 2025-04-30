import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; // Pour la navigation

export default function ChatScreen({ route }) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  // Récupération du nom de l'entreprise depuis les paramètres de la navigation
  const { entrepriseName } = route.params;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        setSelectedDocument(result);
      }
    } catch (error) {
      console.error('Erreur lors du choix du document :', error);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newTextMessage = {
        id: Date.now().toString(),
        type: 'text',
        content: message,
        date: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newTextMessage]);
      setMessage('');
    }
  };

  const sendDocument = () => {
    if (selectedDocument) {
      const newDocMessage = {
        id: Date.now().toString(),
        type: 'document',
        name: selectedDocument.name,
        uri: selectedDocument.uri,
        date: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newDocMessage]);
      setSelectedDocument(null);
    }
  };

  const renderItem = ({ item }) => {
    const messageDate = item.date ? new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    if (item.type === 'text') {
      return (
        <View style={[styles.messageBubble, item.isSender && styles.senderBubble]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>{messageDate}</Text>
        </View>
      );
    } else if (item.type === 'document') {
      return (
        <View style={[styles.messageBubble, item.isSender && styles.senderBubble]}>
          <Ionicons name="document-text-outline" size={20} color="#FFA500" />
          <Text style={[styles.messageText, { marginLeft: 5 }]}>{item.name}</Text>
          <Text style={styles.messageTime}>{messageDate}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header avec nom de l'entreprise et bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{entrepriseName}</Text>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Barre d'envoi */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickDocument} style={styles.iconButton}>
          <Ionicons name="document-attach-outline" size={28} color="#FFA500" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Écrire un message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        {selectedDocument ? (
          <TouchableOpacity onPress={sendDocument} style={styles.sendButton}>
            <Ionicons name="cloud-upload-outline" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: { padding: 10 },
  messageBubble: {
    backgroundColor: '#e6f0ff',
    padding: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
    borderRadius: 10,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderBubble: {
    backgroundColor: '#b0e0e6',
    alignSelf: 'flex-end',
  },
  messageText: { color: '#333', fontSize: 16 },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
    borderRadius: 20,
    backgroundColor: '#FFF0E1',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    marginLeft: 6,
    backgroundColor: '#FFA500',
    padding: 8,
    borderRadius: 20,
  },
});
