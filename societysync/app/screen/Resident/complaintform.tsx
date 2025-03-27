import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ComplaintForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !phone || !houseNumber || !complaintType || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    Alert.alert("Success", "Your complaint has been submitted!");

    setName("");
    setPhone("");
    setHouseNumber("");
    setComplaintType("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Submit a Complaint</Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="phone" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="home" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="House Number"
          keyboardType="numeric"
          value={houseNumber}
          onChangeText={setHouseNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="alert-circle" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Complaint Type (e.g., Water, Electricity, Security)"
          value={complaintType}
          onChangeText={setComplaintType}
        />
      </View>

      <View style={[styles.inputContainer, styles.textAreaContainer]}>
        <MaterialCommunityIcons name="text" style={styles.icon} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your complaint..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#EFF3F6",
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  icon: {
    fontSize: 20,
    color: "#666",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  textAreaContainer: {
    alignItems: "flex-start",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#8a7a82",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ComplaintForm;
