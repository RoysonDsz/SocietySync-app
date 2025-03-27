import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

const PresidentDashboard: React.FC = () => {
  const router = useRouter();

  const items = [
    {
      title: "Complaints",
      color: "#3498db",
      icon: "message-alert",
      path: "/screen/President/ComplaintsPage",
    },
    {
      title: "Residents",
      color: "#2ecc71",
      icon: "account-group",
      path: "/screen/President/PResidentLogBook",
    },
    {
      title: "Event Management",
      color: "#9b59b6",
      icon: "calendar-month",
      path: "/screen/President/EventManagement",
    },
    {
      title: "Notifications",
      color: "#f39c12",
      icon: "bell",
      path: "/screen/President/BroadcastSystem",
    },
    {
      title: "Emergency Respond",
      color: "#e74c3c",
      icon: "alert-circle",
      path: "/screen/President/EmergencyControl",
    },
    {
      title: "Visitors Log Book",
      color: "#1abc9c",
      icon: "book-open-page-variant",
      path: "/screen/President/PresidentVisiterLog",
    },
  ];

  const handlePress = (path: any) => {
    router.push(path);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.dashboardTitle}>President Dashboard</Text>
      <View style={styles.cardContainer}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handlePress(item.path)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 120,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default PresidentDashboard;