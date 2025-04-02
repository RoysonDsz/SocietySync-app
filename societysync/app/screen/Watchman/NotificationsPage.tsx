import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Add these constants at the top of your file
const primaryBlue = '#180DC9';
const primaryCyan = '#06D9E0';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
}

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Visitor Entry',
      message: 'New visitor John Smith has entered the premises.',
      timestamp: '2 mins ago',
      type: 'info',
      read: false
    },
    {
      id: '2',
      title: 'Emergency Alert',
      message: 'Suspicious activity detected in Block C.',
      timestamp: '15 mins ago',
      type: 'alert',
      read: false
    },
    {
      id: '3',
      title: 'Shift Change',
      message: 'Your night shift replacement has been assigned.',
      timestamp: '1 hour ago',
      type: 'info',
      read: true
    }
  ]);

  const getNotificationColor = (type: Notification['type']) => {
    switch(type) {
      case 'alert': return '#ff6b6b';
      case 'info': return '#3498db';
      case 'success': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getGradientColors = (type: Notification['type']) => {
    switch(type) {
      case 'alert': return ['#ff6b6b', '#ff8e8e'];
      case 'info': return ['#2980b9', '#3498db'];  // Blue gradient
      case 'success': return ['#27ae60', '#2ecc71'];
      default: return ['#7f8c8d', '#95a5a6'];
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'alert': return 'alert-circle';
      case 'info': return 'information';
      case 'success': return 'check-circle';
      default: return 'bell';
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationContainer, 
        { backgroundColor: item.read ? '#f4f6f9' : '#ffffff' }
      ]}
      onPress={() => markNotificationAsRead(item.id)}
    >
      <LinearGradient
        colors={['#1a5276', '#3498db']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      />
      <View style={styles.notificationIconContainer}>
        <MaterialCommunityIcons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={getNotificationColor(item.type)} 
        />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text 
          style={[
            styles.notificationTitle, 
            { fontWeight: item.read ? 'normal' : 'bold' }
          ]}
        >
          {item.title}
        </Text>
        <Text 
          style={[
            styles.notificationMessage, 
            { color: item.read ? '#7f8c8d' : '#2c3e50' }
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        <Text style={styles.notificationTimestamp}>
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[primaryCyan, primaryBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Notifications</Text>
        </View>
      </LinearGradient>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="bell-off" 
              size={64} 
              color="#bdc3c7" 
            />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  headerBackground: {
    paddingTop: height * 0.05,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '700',
    textAlign:'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  notificationIconContainer: {
    marginRight: 15,
    marginLeft: 5,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.2,
  },
  emptyText: {
    fontSize: 18,
    color: '#bdc3c7',
    marginTop: 15,
  },
});

export default NotificationsPage;