
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
// Get screen dimensions
const { width, height } = Dimensions.get('window');
const ContainerGrid: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", phoneNumber: "" });
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const primaryCyan = "#06D9E0";
  const primaryBlue = "#180DC9";
  // Mock president data - for flat number which isn't in the API response
  const residentInfo = {
    flatNo: "A-501",
  };
  const items = [
    { title: "Maintenance Bills", icon: "wrench", path: "/screen/Resident/maintenance" },
    { title: "Complaint Status", icon: "email-alert", path: "/screen/Resident/complaintStatus" },
    { title: "Visitor Alerts", icon: "account-group", path: "/screen/Resident/visitoralert" },
    { title: "Event Updates", icon: "calendar-star", path: "/screen/Resident/eventbooking" },
    { title: "Parking Slot Info", icon: "car-parking-lights", path: "/screen/Resident/parkingslots" },
    { title: "Emergency Contacts", icon: "alert-circle", path: "/screen/Resident/emergencycontacts" },
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
  const handlePress = (path: string) => {
    router.push(path as any);
  };
  const handleLogout = () => {
    // Handle logout functionality here
    router.replace("/"); // Navigate to login/home screen
    setProfileModalVisible(false);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeTitle}>Welcome to the App</Text>
        <TouchableOpacity 
          style={styles.profileIconContainer}
          onPress={() => setProfileModalVisible(true)}
        >
          <MaterialCommunityIcons name="account-circle" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {/* First Row */}
        <View style={[styles.row, { marginTop: 30 }]}>
          <Pressable style={styles.bigCard} onPress={() => handlePress(items[0].path)}>
            <LinearGradient colors={[primaryCyan, primaryBlue]} style={styles.gradientCard}>
              <MaterialCommunityIcons name={items[0].icon} size={80} color="#fff" style={styles.icon} />
              <Text style={styles.title}>{items[0].title}</Text>
            </LinearGradient>
          </Pressable>
          <View style={styles.smallCardColumn}>
            <Pressable style={styles.smallCard} onPress={() => handlePress(items[1].path)}>
              <LinearGradient colors={[primaryCyan, primaryBlue]} style={styles.gradientCard}>
                <MaterialCommunityIcons name={items[1].icon} size={50} color="#fff" style={styles.icon} />
                <Text style={styles.title}>{items[1].title}</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.smallCard} onPress={() => handlePress(items[2].path)}>
              <LinearGradient colors={[primaryBlue, primaryCyan]} style={styles.gradientCard}>
                <MaterialCommunityIcons name={items[2].icon} size={50} color="#fff" style={styles.icon} />
                <Text style={styles.title}>{items[2].title}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
        {/* Second Row */}
        <View style={styles.row}>
          <View style={styles.smallCardColumn}>
            <Pressable style={styles.smallCard} onPress={() => handlePress(items[3].path)}>
              <LinearGradient colors={[primaryCyan, primaryBlue]} style={styles.gradientCard}>
                <MaterialCommunityIcons name={items[3].icon} size={50} color="#fff" style={styles.icon} />
                <Text style={styles.title}>{items[3].title}</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.smallCard} onPress={() => handlePress(items[4].path)}>
              <LinearGradient colors={[primaryBlue, primaryCyan]} style={styles.gradientCard}>
                <MaterialCommunityIcons name={items[4].icon} size={50} color="#fff" style={styles.icon} />
                <Text style={styles.title}>{items[4].title}</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <Pressable style={styles.bigCard} onPress={() => handlePress(items[5].path)}>
            <LinearGradient colors={[primaryCyan, primaryBlue]} style={styles.gradientCard}>
              <MaterialCommunityIcons name={items[5].icon} size={80} color="#fff" style={styles.icon} />
              <Text style={styles.title}>{items[5].title}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
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
                <Text style={styles.profileTitle}>Resident Profile</Text>
              </LinearGradient>
              
              <View style={styles.profileInfoContainer}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="home" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Flat No:</Text>
                  <Text style={styles.infoValue}>{residentInfo.flatNo}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone" size={24} color={primaryBlue} />
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{user.phoneNumber}</Text>
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
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 90,
    backgroundColor: "#09b5dc",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    fontFamily:"Poppins-Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  smallCardColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "48%",
  },
  bigCard: {
    width: "48%",
    height: 260,
    borderRadius: 15,
    overflow: "hidden",
  },
  smallCard: {
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
    overflow: "hidden",
  },
  gradientCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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
export default ContainerGrid;
