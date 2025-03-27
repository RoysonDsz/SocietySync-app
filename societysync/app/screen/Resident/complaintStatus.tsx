import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter

const ComplaintStatus: React.FC = () => {
  const [complaintStatus, setComplaintStatus] = useState<"Pending" | "Resolved" | "Rejected">("Pending");
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    fetchComplaintStatus();
    const interval = setInterval(fetchComplaintStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchComplaintStatus = async () => {
    try {
      const response = await fetch("https://mrnzp03x-5050.inc1.devtunnels.ms/api/complaint"); // Replace with actual API
      const data = await response.json();
      setComplaintStatus(data.status);
    } catch (error) {
      console.error("Error fetching complaint status:", error);
    } finally {
      setLoading(false);
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
          <Text style={styles.statusText}>Complaint Status: {complaintStatus}</Text>
        )}
      </View>
      
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
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 20 },
  statusBox: { width: "80%", height:"35%", padding: 20, borderRadius: 10, alignItems: "center", justifyContent:"center", marginBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 3 },
  statusText: { fontSize: 18, fontWeight: "bold", color: "#333333" },
  pendingStatus: { backgroundColor: "#e2d3fa" },
  resolvedStatus: { backgroundColor: "green" },
  rejectedStatus: { backgroundColor: "red" },
  button: { backgroundColor: "#9CCAD8", padding: 15, borderRadius: 10, alignItems: "center", width: "90%", marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 3 },
  buttonText: { color: "#333333", fontSize: 16, fontWeight: "bold" },
});

export default ComplaintStatus;
