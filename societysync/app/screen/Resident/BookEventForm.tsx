import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

interface FormData {
  residentNumber: string;
  dateTime: string;
  purpose: string;
}

const BookEventForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    residentNumber: "",
    dateTime: "",
    purpose: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.dateTime.includes("T")) {
        Alert.alert("Invalid date and time format.");
        return;
      }

      const [date, timePart] = formData.dateTime.split("T");
      const time = timePart.slice(0, 5);
      const token = localStorage.getItem("token");

      if (!token) {
        Alert.alert("Authentication token is missing. Please log in again.");
        return;
      }

      await axios.post(
        "https://mrnzp03x-5050.inc1.devtunnels.ms/api/event/create-event",
        {
          residentNumber: formData.residentNumber,
          date,
          time,
          purpose: formData.purpose,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Event booked successfully!");
      setFormData({ residentNumber: "", dateTime: "", purpose: "" });
    } catch (error) {
      console.error("Error booking event:", error);
      Alert.alert("Error booking event. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Booking</Text>

      <Text style={styles.label}>Resident Number</Text>
      <TextInput
        value={formData.residentNumber}
        onChangeText={(text) => handleChange("residentNumber", text)}
        placeholder="Enter Contact Number"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Date & Time</Text>
      <TextInput
        value={formData.dateTime}
        onChangeText={(text) => handleChange("dateTime", text)}
        placeholder="YYYY-MM-DDTHH:MM"
        style={styles.input}
      />

      <Text style={styles.label}>Purpose</Text>
      <TextInput
        value={formData.purpose}
        onChangeText={(text) => handleChange("purpose", text)}
        placeholder="Describe the purpose"
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Button title="Submit Booking" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default BookEventForm;
