import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const WatchmanDashBord: React.FC = () => {
  const router = useRouter();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Mock president data
  const presidentInfo = {
    name: "Royson Doe",
    flatNo: "A-501",
    phoneNumber: "+91 8787895578"
  };

  // Colors from the code
  const primaryBlue = '#180DC9';
  const primaryCyan = '#06D9E0';

  const items = [
    {
      id: "01",
      title: "Notifications",
      icon: "message-alert",
      path: "/screen/Watchman/NotificationsPage",
      gradient: [primaryCyan, primaryBlue]
    },
    {
      id: "02",
      title: "Visitors Alert",
      icon: "book-open-page-variant",
      path: "/screen/Watchman/VisitorManagementSystem",
      gradient: [primaryBlue, primaryCyan]
    },
    {
      id: "03",
      title: "Residents Log",
      icon: "account-group",
      path: "/screen/Watchman/ResidentLogBook",
      gradient: [primaryCyan, primaryBlue]
    },
    {
      id: "04",
      title: "Emergency Alert",
      icon: "alert-circle",
      path: "/screen/Watchman/EmergencyAlertPage",
      gradient: [primaryBlue, primaryCyan]
    },
  ];

  const handlePress = (path: any) => {
    router.push(path);
  };

  const handleLogout = () => {
    // Handle logout functionality here
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
            <Text style={styles.helloText}>Hello, WatchMan</Text>
            <Text style={styles.welcomeText}>Welcome to the App</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIconContainer}
            onPress={() => setProfileModalVisible(true)}
          >
            <MaterialCommunityIcons name="account-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Cards Container - positioned to overlap with top container */}
      <View style={styles.cardsContainer}>
        <FlatList
          data={items}
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
                {/* Number bubble indicator */}
                <View style={styles.numberBubbleContainer}>
                  <View style={styles.numberBubble}>
                    <Text style={styles.numberText}>{item.id}</Text>
                  </View>
                </View>
                
                {/* Title and content section */}
                <View style={styles.cardContentContainer}>
                  <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
                  <Text style={styles.cardSubtitle}>INFOGRAPHICS</Text>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.textSection}>
                      <Text style={styles.cardDescription}>
                        Manage and view all {item.title.toLowerCase()} with just a tap
                      </Text>
                    </View>
                    
                    <View style={styles.iconCircle}>
                      <MaterialCommunityIcons name={item.icon} size={22} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
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
                <Text style={styles.profileTitle}>WatchMan Profile</Text>
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
                  <Text style={styles.infoValue}>{presidentInfo.flatNo}</Text>
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
    paddingTop: height * 0.03,
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
    marginTop: 20,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  helloText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  // Cards Container styling
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
    marginHorizontal: 8,
    marginVertical: 10,
    height: 100, // Fixed height for all cards
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  // Number bubble styling
  numberBubbleContainer: {
    position: 'absolute',
    right: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  numberText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  // Card content styling
  cardContentContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 60, // Space for the number bubble
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  textSection: {
    flex: 1,
    marginRight: 10,
  },
  cardDescription: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  
  // Modal Styles - keeping the original modal styling
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
    position: 'relative',
  },
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

export default WatchmanDashBord;