import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Button, Alert 
} from "react-native";

const totalSlots = 20;

const ParkingSlot: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<{ slot: number; residentId: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    residentId: "Resident101",
    name: "",
    houseNumber: "",
    vehicleNumber: "",
    date: "",
  });

  useEffect(() => {
    // Simulated database fetch
    setBookedSlots([{ slot: 3, residentId: "Resident102" }, { slot: 7, residentId: "Resident101" }]);
  }, []);

  const residentBookings = bookedSlots.filter(slot => slot.residentId === formData.residentId).length;

  const handleBooking = (slotNumber: number) => {
    if (residentBookings >= 2) {
      Alert.alert("Limit Reached", "You have already booked 2 slots. Request admin approval for more.");
      return;
    }

    setSelectedSlot(slotNumber);
    setModalVisible(true);
  };

  const confirmBooking = () => {
    if (!formData.name || !formData.houseNumber || !formData.vehicleNumber || !formData.date) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    if (selectedSlot !== null) {
      setBookedSlots([...bookedSlots, { slot: selectedSlot, residentId: formData.residentId }]);
      Alert.alert("Success", `Slot ${selectedSlot} booked successfully!`);
      setModalVisible(false);
      setFormData({ ...formData, name: "", houseNumber: "", vehicleNumber: "", date: "" });
    }
  };

  const handleCancelBooking = (slotNumber: number) => {
    setBookedSlots(bookedSlots.filter(slot => slot.slot !== slotNumber));
    Alert.alert("Booking Canceled", `Slot ${slotNumber} is now available.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Parking Slot Booking</Text>
      </View>

      <View style={styles.slotGrid}>
        <FlatList
          data={Array.from({ length: totalSlots }, (_, i) => i + 1)}
          numColumns={4}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <View style={styles.slotContainer}>
              <TouchableOpacity
                style={[styles.slot, bookedSlots.some((slot) => slot.slot === item) ? styles.bookedSlot : styles.availableSlot]}
                onPress={() => handleBooking(item)}
                disabled={bookedSlots.some((slot) => slot.slot === item)}
              >
                <Text style={styles.slotText}>{bookedSlots.some((slot) => slot.slot === item) ? "Booked" : item}</Text>
              </TouchableOpacity>
              {bookedSlots.some((slot) => slot.slot === item) && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Booking Details</Text>
            <TextInput style={styles.input} placeholder="Name" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />
            <TextInput style={styles.input} placeholder="House Number" value={formData.houseNumber} onChangeText={(text) => setFormData({ ...formData, houseNumber: text })} />
            <TextInput style={styles.input} placeholder="Vehicle Number" value={formData.vehicleNumber} onChangeText={(text) => setFormData({ ...formData, vehicleNumber: text })} />
            <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={formData.date} onChangeText={(text) => setFormData({ ...formData, date: text })} />

            <View style={styles.modalButtons}>
              <Button title="Confirm" color="#769eb5" onPress={confirmBooking} />
              <Button title="Cancel" color="#C48A7E" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF3F6", padding: 20 },
  headerBox: { padding: 15, borderRadius: 10, alignItems: "center", marginTop:20 ,marginBottom:70},
  pageTitle: { fontSize: 30, color: "black", fontWeight: "bold" },
  slotGrid: { alignItems: "center" },
  slotContainer: { margin: 5 },
  slot: { width: 60, height: 60, borderRadius: 10, justifyContent: "center", alignItems: "center", elevation: 3 },
  availableSlot: { backgroundColor: "#769eb5" },
  bookedSlot: { backgroundColor: "#D97B5A" },
  slotText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#FF9800", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 },
  cancelText: { color: "black" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { width: "100%", borderWidth: 1, borderColor: "black", padding: 10, borderRadius: 8, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
});

export default ParkingSlot; 