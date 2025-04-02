import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; 
import axios from 'axios';
import { LinearGradient } from "expo-linear-gradient";

const ComplaintStatus: React.FC = () => {
  const [complaintStatus, setComplaintStatus] = useState<"Pending" | "Resolved" | "Rejected">("Pending");
  const [loading, setLoading] = useState(true);
  const [complaintData, setComplaintData] = useState<any>(null);
  const [client, setClient] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    fetchComplaintStatus();
    const interval = setInterval(fetchComplaintStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/user/ownProfile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setClient(response.data.response || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const fetchComplaintStatus = async () => {
    try {
      const response = await axios.get("https://mrnzp03x-5050.inc1.devtunnels.ms/api/complaint/get-complaint"); 
      if (response.data) {
        setComplaintStatus(response.data.status);
        setComplaintData(response.data.response);
      }
    } catch (error) {
      console.error("Error fetching complaint status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Complaints</Text>
      </View>

      <LinearGradient
        colors={["#3DEDFB", "#1C28F4"]}
        style={styles.statusBox}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Text style={styles.statusText}>Complaint Status: {complaintStatus}</Text>
            {complaintData && (
              <View style={styles.complaintDetails}>
                <Text style={styles.complaintDetail}>Name: {client.name}</Text>
                <Text style={styles.complaintDetail}>Role: {client.role}</Text>
                <Text style={styles.complaintDetail}>Complaint: {complaintData.complaint}</Text>
                <Text style={styles.complaintDetail}>Created At: {new Date(complaintData.createdAt).toLocaleString()}</Text>
                <Text style={styles.complaintDetail}>Updated At: {new Date(complaintData.updatedAt).toLocaleString()}</Text>
              </View>
            )}
          </>
        )}
      </LinearGradient>

      <LinearGradient
        colors={["#0b9dd9", "#07d4e0"]}
        style={styles.button}
      >
        <TouchableOpacity 
          style={{ width: "100%", alignItems: "center" }} 
          onPress={() => router.push("/screen/Resident/complaintform" as any)}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            Do you have any complaint?
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF3F6",
    paddingTop: 50,
  },
  titleContainer: {
    position: "absolute",
    top: 80,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  statusBox: {
    width: "80%",
    height: "35%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  statusText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Poppins-Bold"
  },
  complaintDetails: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  complaintDetail: {
    fontSize: 20,
    color: "#fff",
    marginVertical: 2,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ComplaintStatus;
