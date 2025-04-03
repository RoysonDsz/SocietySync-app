import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from "expo-router"; 
import axios from 'axios';

const ComplaintStatus: React.FC = () => {
  const [complaintStatus, setComplaintStatus] = useState<"Pending" | "Resolved" | "Rejected">("Pending");
  const [loading, setLoading] = useState(true);
  const [complaintData, setComplaintData] = useState<any>(null); // Store complaint data
  const [complaintText, setComplaintText] = useState(''); // State for complaint input
  const router = useRouter(); 

  useEffect(() => {
    fetchComplaintStatus();
    const interval = setInterval(fetchComplaintStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchComplaintStatus = async () => {
    try {
      const response = await axios.get("https://vt92g6tf-5050.inc1.devtunnels.ms/api/complaint/get-complaint"); 
      console.log(response.data);
      if (response.data) {
        setComplaintStatus(response.data.status);  // Set complaint status
        setComplaintData(response.data); // Set the full complaint data
      }
    } catch (error) {
      console.error("Error fetching complaint status:", error);
    } finally {
      setLoading(false);
    }
  };

  const postComplaint = async () => {
    try {
      const response = await axios.post("https://vt92g6tf-5050.inc1.devtunnels.ms/api/complaint/create-complaint", 
        { complaint: complaintText }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log(response.data);
      if (response.data.success) {
        alert('Complaint posted successfully!');
        setComplaintText(''); // Clear the input field
      } else {
        alert('Failed to post complaint.');
      }
    } catch (error) {
      console.error("Error posting complaint:", error);
      alert('Error posting complaint.');
    }
  };

  const getStatusStyle = () => {
    switch (complaintStatus) {
      case "Pending":
        return styles.pendingStatus;
      case "Resolved":
        return styles.resolvedStatus;
      case "Rejected":
        return styles.rejectedStatus;
      default:
        return styles.pendingStatus;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Complaint Status</Text>
      </View>

      <View style={[styles.statusBox, getStatusStyle()]}> 
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Text style={styles.statusText}>Complaint Status: {complaintStatus}</Text>
            {complaintData && (
              <View style={styles.complaintDetails}>
                <Text style={styles.complaintDetail}>Name: {complaintData.name}</Text>
                <Text style={styles.complaintDetail}>Role: {complaintData.role}</Text>
                <Text style={styles.complaintDetail}>Complaint: {complaintData.complaint}</Text>
                <Text style={styles.complaintDetail}>Created At: {new Date(complaintData.createdAt).toLocaleString()}</Text>
                <Text style={styles.complaintDetail}>Updated At: {new Date(complaintData.updatedAt).toLocaleString()}</Text>
              </View>
            )}
          </>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your complaint here"
        value={complaintText}
        onChangeText={setComplaintText}
        multiline
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={postComplaint}
      >
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/screen/Resident/complaintform" as any)} // Navigate using Expo Router
      >
        <Text style={styles.buttonText}>Do you have any complaint?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EFF3F6", paddingTop: 50 },
  titleContainer: { position: "absolute", top: 80, width: "100%", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", color: "#1710c9", marginBottom: 20 },
  statusBox: { width: "80%", height:"35%", padding: 20, borderRadius: 10, alignItems: "center", justifyContent:"center", marginBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 3 },
  statusText: { fontSize: 25, fontWeight: "bold", color: "#333333" },
  complaintDetails: { marginTop: 10, alignItems: "flex-start" },
  complaintDetail: { fontSize: 20, color: "#333333", marginVertical: 2 },
  pendingStatus: { backgroundColor: "white" },
  resolvedStatus: { backgroundColor: "green" },
  rejectedStatus: { backgroundColor: "red" },
  button: { backgroundColor: "white", padding: 15, borderRadius: 10, alignItems: "center", width: "90%", marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 3 },
  buttonText: { color: "#1710c9", fontSize: 20, fontWeight: "bold" },
  input: { width: "90%", height: 100, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20, textAlignVertical: 'top' }
});

export default ComplaintStatus;