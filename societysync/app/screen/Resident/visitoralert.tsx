import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const VisitorAlert: React.FC = () => {
  const [buildingNumber, setBuildingNumber] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitTime, setVisitTime] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = () => {
    {
      /*
      axios.post('https://example.com/api/user', notificationData)
    .then(response => {
        // This block will execute if the request is successful
        console.log('Success:', response.data);
    })
    .catch(error => {
        // This block will execute if there's an error in the request
        console.error('Error:', error);
    });
       */
    }
    if (buildingNumber.trim() === "" || visitorName.trim() === "" || visitTime.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    alert(`Visitor alert sent! \nBuilding/Flat: ${buildingNumber} \nVisitor: ${visitorName} \nTime: ${visitTime}`);

    // Trigger animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => fadeAnim.setValue(0));

    // Clear input fields
    setBuildingNumber("");
    setVisitorName("");
    setVisitTime("");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.alertBox, { opacity: fadeAnim }]}> 
        <Text style={styles.alertText}>✅ Alert Sent Successfully!</Text>
      </Animated.View>

      <Text style={styles.pageTitle}>Notify Security</Text>

      <TextInput
        style={styles.input}
        placeholder="Building/Flat Number"
        value={buildingNumber}
        onChangeText={setBuildingNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Visitor Name"
        value={visitorName}
        onChangeText={setVisitorName}
      />

      <TextInput
        style={styles.input}
        placeholder="Expected Arrival Time (e.g., 5:00 PM)"
        value={visitTime}
        onChangeText={setVisitTime}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send Alert</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF3F6",
    padding: 20,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60,
    color: "black",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor:  "black",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#4A6B8A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  alertBox: {
    position: "absolute",
    top: 60,
    backgroundColor: "#81C784",
    padding: 10,
    borderRadius: 8,
  },
  alertText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VisitorAlert;