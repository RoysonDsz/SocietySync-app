import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Linking } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const emergencyContacts = [
  { id: "1", title: "Security", number: "123-456-7890", icon: "shield-lock" },
  { id: "2", title: "Ambulance", number: "987-654-3210", icon: "ambulance" },
  { id: "3", title: "Fire Department", number: "101-202-3030", icon: "fire-truck" },
  { id: "4", title: "Police", number: "112-223-3344", icon: "police-badge" },
];

const EmergencyContacts: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const filteredContacts = emergencyContacts.filter((contact) =>
    contact.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Emergency Contacts</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={item.icon} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.number}>{item.number}</Text>
            </View>
            <TouchableOpacity onPress={() => handleCall(item.number)} style={styles.callButton}>
              <MaterialCommunityIcons name="phone" style={styles.phoneIcon} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#EFF3F6", // Modern greyish background
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2C3E50",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#9CCAD8",
    padding: 14,
    borderRadius: 12,
  },
  icon: {
    fontSize: 30,
    color: "#2C3E50",
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  number: {
    fontSize: 15,
    color: "#7F8C8D",
  },
  callButton: {
    backgroundColor: "#5F87A0",
    padding: 10,
    borderRadius: 10,
  },
  phoneIcon: {
    fontSize: 24,
    color: "#fff",
  },
});

export default EmergencyContacts;