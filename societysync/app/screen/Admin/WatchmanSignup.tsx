import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';


const WatchmanSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    buildingNumber: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (key: string, value: string) => {
    // Restrict phoneNumber to digits only
    if (key === "phoneNumber" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { name, password, buildingNumber, address, phoneNumber } = formData;

    // Basic validation
    if (!name || !password || !buildingNumber || !address || !phoneNumber) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    Alert.alert("Success", "Watchman registered successfully!");
    console.log("Form Submitted", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Watchman Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Building Number"
        value={formData.buildingNumber}
        onChangeText={(text) => handleChange("buildingNumber", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="numeric"
        value={formData.phoneNumber}
        onChangeText={(text) => handleChange("phoneNumber", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e3a8a",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4361ee",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WatchmanSignup;
