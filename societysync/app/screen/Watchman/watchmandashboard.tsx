import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

const WatchManDashBoard: React.FC = () => {
  const router = useRouter();

  const items = [
    {
      title: "Visitor Alerts",
      color: "#94bb7c",
      icon: "account-group",
      path: "/screen/Watchman/VisitorManagementSystem",
    },
    {
      title: "Resident Log Book",
      color: "#f27475",
      icon: "calendar-star",
      path: "/screen/Watchman/ResidentLogBook",
    },
    {
      title: "Emergency Alert",
      color: "#e74c3c",
      icon: "alert-circle",
      path: "/screen/Watchman/EmergencyAlertPage",
    },
  ];


  

  const handlePress = (path:any) => {
    router.push(path);
  };

  return (
    <View style={styles.mainContainer}>
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
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: 120, // Fixed height for consistent card size
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default WatchManDashBoard;
