import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dynamic dimensions with responsive handling
const windowDimensions = Dimensions.get('window');

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
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState({
    width: windowDimensions.width,
    height: windowDimensions.height
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Update dimensions when screen size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
    });

    return () => subscription?.remove();
  }, []);

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://vt92g6tf-5050.inc1.devtunnels.ms/api/alert/visitors'); // Replace with your actual API endpoint
        const data = await response.json();

        // Format the response data to match the notification format
        const formattedNotifications = data.map((visitor: any) => ({
          id: visitor._id, // Assuming the visitor has an _id field
          title: `Flat number: ${visitor.FlatNumber}`,
          message: `Visitor: ${visitor.visitorName}, Arriving at: ${visitor.visitTime}`,
          timestamp: `${new Date(visitor.createdAt).toLocaleTimeString()}`, // Using createdAt as timestamp
          type: 'info', // You can modify this based on certain conditions
          read: false
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return '#ff6b6b';
      case 'info': return '#3498db';
      case 'success': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
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
      style={[styles.notificationContainer, 
        { backgroundColor: item.read ? '#f4f6f9' : '#ffffff' }]}
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
          size={dimensions.width * 0.06 > 24 ? 24 : dimensions.width * 0.06} 
          color={getNotificationColor(item.type)} 
        />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text 
          style={[styles.notificationTitle, 
            { 
              fontWeight: item.read ? 'normal' : 'bold',
              fontSize: dimensions.width * 0.04 > 16 ? 16 : dimensions.width * 0.04
            }
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text 
          style={[styles.notificationMessage, 
            { 
              color: item.read ? '#7f8c8d' : '#2c3e50',
              fontSize: dimensions.width * 0.035 > 14 ? 14 : dimensions.width * 0.035
            }
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.message}
        </Text>
        <Text 
          style={[styles.notificationTimestamp,
            { fontSize: dimensions.width * 0.03 > 12 ? 12 : dimensions.width * 0.03 }
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Calculate dynamic padding based on safe area
  const headerPadding = {
    paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || dimensions.height * 0.05,
    paddingBottom: dimensions.width * 0.05
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[primaryCyan, primaryBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerBackground, headerPadding]}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={dimensions.width * 0.06 > 24 ? 24 : dimensions.width * 0.06} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          <Text 
            style={[styles.headerTitle, 
              { 
                color: '#ffffff',
                fontSize: dimensions.width * 0.05 > 20 ? 20 : dimensions.width * 0.05
              }
            ]}
            numberOfLines={1}
          >
            Notifications
          </Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>
      
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, {
          paddingHorizontal: dimensions.width * 0.05,
          minHeight: dimensions.height - (headerPadding.paddingTop + headerPadding.paddingBottom + 100)
        }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { marginTop: dimensions.height * 0.15 }]}>
            <MaterialCommunityIcons 
              name="bell-off" 
              size={dimensions.width * 0.15 > 64 ? 64 : dimensions.width * 0.15} 
              color="#bdc3c7" 
            />
            <Text style={[styles.emptyText, { fontSize: dimensions.width * 0.045 > 18 ? 18 : dimensions.width * 0.045 }]}>
              No notifications
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  headerBackground: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    padding: '4%',
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
    marginRight: '4%',
    marginLeft: '1%',
    width: '10%',
    alignItems: 'center',
  },
  notificationTextContainer: {
    flex: 1,
    width: '85%',
  },
  notificationTitle: {
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationMessage: {
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationTimestamp: {
    color: '#7f8c8d',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#bdc3c7',
    marginTop: 15,
  },
});

export default NotificationsPage;
