import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios'
// Get screen dimensions
const { width, height } = Dimensions.get('window');

const PresidentDashboard: React.FC = () => {
  const router = useRouter();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  interface PresidentInfo {
    name: string;
    flatNo: string;
    phoneNumber: string;
  }

  const [presidentInfo, setUser] = useState({});
  // Mock president data
 
  // Colors from the image
  const primaryBlue = '#180DC9';
  const primaryCyan = '#06D9E0';

  const items = [
    {
      title: "Complaints",
      icon: "message-alert",
      path: "/screen/President/ComplaintsPage",
      gradient: [primaryCyan, primaryBlue]
    },
    {
      title: "Notifications",
      icon: "bell",
      path: "/screen/President/BroadcastSystem",
      gradient: [primaryBlue, primaryCyan]
    },
    {
      title: "Residents",
      icon: "account-group",
      path: "/screen/President/PResidentLogBook",
      gradient: [primaryCyan, primaryBlue]
    },
    {
      title: "Emergency Respond",
      icon: "alert-circle",
      path: "/screen/President/EmergencyControl",
      gradient: [primaryBlue, primaryCyan]
    },
    {
      title: "Event Management",
      icon: "calendar-month",
      path: "/screen/President/EventManagement",
      gradient: [primaryCyan, primaryBlue]
    },
    {
      title: "Visitors Log",
      icon: "book-open-page-variant",
      path: "/screen/President/PresidentVisiterLog",
      gradient: [primaryBlue, primaryCyan]
    },
    {
      title: "Billing",
      icon: "book-open-page-variant",
      path: "/screen/President/MaintainencePage",
      gradient: [primaryBlue, primaryCyan]
    },
    {
      title: "History",
      icon: "book-open-page-variant",
      path: "/screen/President/PaymentHistoryPage",
      gradient: [primaryBlue, primaryCyan]
    }
  ];
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://vt92g6tf-5050.inc1.devtunnels.ms/api/user/ownProfile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUser(response.data.response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePress = (path:any) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Handle logout functionality here
    // For example: clear storage, reset state, navigate to login
    router.replace("/"); // Navigate to login/home screen
    setProfileModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Container with gradient background */}
      <LinearGradient
        colors={[primaryCyan, primaryBlue]}
        style={styles.topContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Redesigned header with profile and welcome text on the same line */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.helloText}>Hello, President</Text>
            <Text style={styles.welcomeText}>Welcome to the App</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIconContainer}
            onPress={() => setProfileModalVisible(true)}
          >
            <MaterialCommunityIcons name="account-circle" size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Cards Container - positioned to overlap with top container */}
      <View style={styles.cardsContainer}>
        <FlatList
          data={items}
          numColumns={1} // Changed from 2 to 1 to make it single column
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => handlePress(item.path)} 
              style={styles.dashboardItem}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={index % 2 === 0 ? [primaryCyan, primaryBlue] : [primaryBlue, primaryCyan]}
                style={styles.itemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.itemContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={item.icon} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Profile Info Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={() => setProfileModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalContent}>
              <LinearGradient
                colors={[primaryCyan, primaryBlue]}
                style={styles.profileHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Close button (X) */}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <MaterialCommunityIcons name="account-circle" size={70} color="#FFFFFF" />
                <Text style={styles.profileTitle}>President Profile</Text>
              </LinearGradient>
              
              <View style={styles.profileInfoContainer}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{presidentInfo.name}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="home" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Flat No:</Text>
                  <Text style={styles.infoValue}>211</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{presidentInfo.phoneNumber}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <LinearGradient
                    colors={[primaryBlue, primaryCyan]}
                    style={styles.logoutButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  // Top Container styling with gradient
  topContainer: {
    paddingTop: height * 0.03, // Reduced to move everything up
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    paddingBottom: 60,
    height: height * 0.28,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20, // Added margin to position header lower from the top edge
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1, // Allow text to take available space
  },
  helloText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  // Cards Container styling - positioned to overlap
  cardsContainer: {
    flex: 1,
    marginTop: -50,
    zIndex: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  dashboardItem: {
    width: '100%', // Take full width for single column
    margin: 8,
    height: height * 0.12, // Reduced height for better fit in single column
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  itemGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  itemContent: {
    flexDirection: 'row', // Changed to row for horizontal layout
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20, // Add space between icon and text
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalContent: {
    width: '100%',
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative', // Added for absolute positioning of close button
  },
  // Close button styles
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileInfoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666666',
    width: 60,
  },
  infoValue: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PresidentDashboard;