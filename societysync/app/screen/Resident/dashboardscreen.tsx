import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

const ContainerGrid: React.FC = () => {
  const router = useRouter();

  const items = [
    { title: "Maintenance Bills", color: "#9CCAD8", icon: "wrench", path: "/screen/Resident/maintenance" },
    { title: "Complaint Status", color: "#e2d3fa", icon: "email-alert", path: "/screen/Resident/complaintStatus" },
    { title: "Visitor Alerts", color: "#769eb5", icon: "account-group", path: "/screen/Resident/visitoralert" },
    { title: "Event Updates", color: "#e2d3fa", icon: "calendar-star", path: "/screen/Resident/eventbooking" },
    { title: "Parking Slot Info", color: "#769eb5", icon: "car-parking-lights", path: "/screen/Resident/parkingslots" },
    { title: "Emergency Contacts", color: "#9CCAD8", icon: "alert-circle", path: "/screen/Resident/emergencycontacts" },
  ];

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome to SocietySync</Text>
        <Text style={styles.welcomeSubtitle}>Your community management platform</Text>
      </View>

      {/* First Row: Big card on left, two small cards stacked on right */}
      <View style={styles.row}>
        <Pressable
          style={[styles.bigCard, { backgroundColor: items[0].color }]}
          onPress={() => handlePress(items[0].path)}
        >
          <MaterialCommunityIcons name={items[0].icon} size={28} color="#fff" style={styles.icon} />
          <Text style={styles.title}>{items[0].title}</Text>
        </Pressable>
        <View style={styles.smallCardColumn}>
          <Pressable
            style={[styles.smallCard, { backgroundColor: items[1].color }]}
            onPress={() => handlePress(items[1].path)}
          >
            <MaterialCommunityIcons name={items[1].icon} size={28} color="#fff" style={styles.icon} />
            <Text style={styles.title}>{items[1].title}</Text>
          </Pressable>
          <Pressable
            style={[styles.smallCard, { backgroundColor: items[2].color }]}
            onPress={() => handlePress(items[2].path)}
          >
            <MaterialCommunityIcons name={items[2].icon} size={28} color="#fff" style={styles.icon} />
            <Text style={styles.title}>{items[2].title}</Text>
          </Pressable>
        </View>
      </View>

      {/* Second Row: Two small cards on left, big card on right */}
      <View style={styles.row}>
        <View style={styles.smallCardColumn}>
          <Pressable
            style={[styles.smallCard, { backgroundColor: items[3].color }]}
            onPress={() => handlePress(items[3].path)}
          >
            <MaterialCommunityIcons name={items[3].icon} size={28} color="#fff" style={styles.icon} />
            <Text style={styles.title}>{items[3].title}</Text>
          </Pressable>
          <Pressable
            style={[styles.smallCard, { backgroundColor: items[4].color }]}
            onPress={() => handlePress(items[4].path)}
          >
            <MaterialCommunityIcons name={items[4].icon} size={28} color="#fff" style={styles.icon} />
            <Text style={styles.title}>{items[4].title}</Text>
          </Pressable>
        </View>
        <Pressable
          style={[styles.bigCard, { backgroundColor: items[5].color }]}
          onPress={() => handlePress(items[5].path)}
        >
          <MaterialCommunityIcons name={items[5].icon} size={28} color="#fff" style={styles.icon} />
          <Text style={styles.title}>{items[5].title}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#EFF3F6",
    paddingHorizontal: 15,
    paddingTop:20
  },
  welcomeContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  smallCardColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "48%",
  },
  bigCard: {
    width: "48%",
    height: 260,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  smallCard: {
    height: 120, // Half of the big card height
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom:10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default ContainerGrid;
