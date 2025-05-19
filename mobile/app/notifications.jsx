import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const api_URL = 'http://192.168.90.20:5000/api/auth';

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${api_URL}/notification`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Impossible de charger les notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${api_URL}/notification/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifs => notifs.map(n => 
        n.id === notificationId ? {...n, lu: true} : n
      ));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000041" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/tabs/home')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000041" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Ionicons name="notifications" size={24} color="#000041" />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.card,
                !item.lu && styles.unreadCard
              ]}
              onPress={() => markAsRead(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.typeText}>{item.type}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.senderText}>De: {item.expediteur}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#000041']}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButton: {
    padding: 10
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000041'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  unreadCard: {
    backgroundColor: '#f0f4ff',
    borderLeftWidth: 3,
    borderLeftColor: '#000041'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  typeText: {
    fontSize: 12,
    color: '#ff7b00',
    textTransform: 'capitalize',
    fontWeight: '500'
  },
  dateText: {
    fontSize: 12,
    color: '#888'
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5
  },
  senderText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5
  },
  listContent: {
    paddingBottom: 20
  }
});