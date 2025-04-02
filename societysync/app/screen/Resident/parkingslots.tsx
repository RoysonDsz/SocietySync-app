import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Button, Alert 
} from "react-native";
import axios from 'axios';

const totalSlots = 20;
const API_BASE_URL = 'https://mrnzp03x-5050.inc1.devtunnels.ms/api/parking';

interface ParkingSlot {
  _id?: string;
  vehicleNumber: string;
  residentName: string;
  residentNumber: string;
  slotNumber: string;
  status: 'Occupied' | 'Available';
  createdAt?: Date;
}

const ParkingSlot: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<ParkingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [client,setClient] = useState([]);
  const [formData, setFormData] = useState<ParkingSlot>({
    residentName: "",
    residentNumber: "",
    vehicleNumber: "",
    slotNumber: "",
    status: 'Occupied'
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/user/ownProfile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        formData.residentName=response.data.response.name;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-parkings`);
      const occupiedSlots = response.data.filter((slot: ParkingSlot) => slot.status === 'Occupied');
      setBookedSlots(occupiedSlots);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch booked slots');
      console.error(error);
    }
  };

  const getResidentBookingsCount = () => {
    return bookedSlots.filter(slot => 
      slot.residentNumber === formData.residentNumber
    ).length;
  };

  const handleBooking = (slotNumber: number) => {
    const residentBookings = getResidentBookingsCount();
    
    if (formData.residentNumber && residentBookings >= 2) {
      Alert.alert("Limit Reached", "You have already booked 2 slots. Request admin approval for more.");
      return;
    }

    setSelectedSlot(slotNumber);
    setFormData(prev => ({
      ...prev,
      slotNumber: slotNumber.toString()
    }));
    setModalVisible(true);
  };

  const confirmBooking = async () => {
    if (!formData.residentName || !formData.residentNumber || !formData.vehicleNumber || !formData.slotNumber) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    const payload = {
      vehicleNumber: formData.vehicleNumber,
      residentName: formData.residentName,
      residentNumber: formData.residentNumber,
      slotNumber: formData.slotNumber,
      status: 'Occupied',
    };

    console.log("Sending payload to API:", payload);

    try {
      const response = await axios.post(`${API_BASE_URL}/book-parkings`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("API Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", `Slot ${formData.slotNumber} booked successfully!`);
        setModalVisible(false);
        setFormData({
          residentName: "",
          residentNumber: "",
          vehicleNumber: "",
          slotNumber: "",
          status: 'Occupied',
        });
        setSelectedSlot(null);
        await fetchBookedSlots();
      } else {
        Alert.alert("Error", "Unexpected response from server");
      }
    } catch (error : any) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Booking Error:", error.response?.data || error);
      Alert.alert("Error", `Failed to book slot: ${errorMessage}`);
    }
  };

  const handleCancelBooking = async (slotId?: string) => {
    if (!slotId) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-parkings/${slotId}`);
      if (response.status === 200) {
        Alert.alert("Booking Canceled", `Slot is now available.`);
        await fetchBookedSlots();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
      console.error('Cancel error:', error);
    }
  };

  const renderSlotItem = ({ item }: { item: number }) => {
    const isBooked = bookedSlots.some(slot => parseInt(slot.slotNumber) === item);
    const bookedSlot = bookedSlots.find(slot => parseInt(slot.slotNumber) === item);

    return (
      <View style={styles.slotContainer}>
        <TouchableOpacity
          style={[styles.slot, isBooked ? styles.bookedSlot : styles.availableSlot]}
          onPress={() => handleBooking(item)}
          disabled={isBooked}
        >
          <Text style={styles.slotText}>{isBooked ? "Booked" : item.toString()}</Text>
        </TouchableOpacity>
        {isBooked && bookedSlot?._id && (
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => handleCancelBooking(bookedSlot._id)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
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
          renderItem={renderSlotItem}
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Booking Details</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Resident Name" 
              value={formData.residentName} 
              onChangeText={(text) => setFormData(prev => ({ ...prev, residentName: text }))} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Resident Number" 
              value={formData.residentNumber} 
              onChangeText={(text) => setFormData(prev => ({ ...prev, residentNumber: text }))} 
              keyboardType="phone-pad"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Vehicle Number" 
              value={formData.vehicleNumber} 
              onChangeText={(text) => setFormData(prev => ({ ...prev, vehicleNumber: text }))} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Slot Number" 
              value={formData.slotNumber} 
              editable={false}
            />

            <View style={styles.modalButtons}>
              <Button title="Confirm" color="#769eb5" onPress={confirmBooking} />
              <Button title="Cancel" color="#C48A7E" onPress={() => {
                setModalVisible(false);
                setSelectedSlot(null);
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF3F6", padding: 20 },
  headerBox: { padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20, marginBottom: 70 },
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