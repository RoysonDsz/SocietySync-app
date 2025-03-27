import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



export default function Dashboard() {
  const router = useRouter();

  // Define the role cards with their icons and correct route strings
  const roleCards: { title: string; icon: keyof typeof Ionicons.glyphMap; route: string; color: string }[] = [
    { title: "Admin", icon: "shield-checkmark", route: "/screen/Admin", color: "#4A90E2" },
    { title: "Client", icon: "person", route: "/screen/Resident", color: "#50C878" },
    { title: "Security", icon: "lock-closed", route: "/screen/Watchman", color: "#FF6B6B" },
    { title: "President", icon: "star", route: "/screen/President", color: "#FFD700" },
    { title: "Authentication", icon: "star", route:"./screen/SignupScreen" , color: "#FFD700" },


  ];
  

  const handleCardPress = (route:any) => {
    router.push(route); // Ensure route is a valid string
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Role</Text>

      <View style={styles.cardsContainer}>
        {roleCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: card.color }]}
            onPress={() => handleCardPress(card.route)}
          >
            <Ionicons name={card.icon} size={40} color="white" />
            <Text style={styles.cardTitle}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginTop: 40,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 150,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});
