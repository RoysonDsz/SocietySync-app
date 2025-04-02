import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { DeleteIcon } from "lucide-react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router"; // ✅ Replaces useNavigation

interface Event {
  residentName: ReactNode;
  id: string;
  name: string;
  date: string;
  time: string;
  icon: string;
  creatorId: string;
}

const EventList: React.FC = () => {
  const router = useRouter(); // ✅ Use Expo Router instead of React Navigation
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const getAllEvents = async () => {
    try {
      const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/event/getAll-event`);
      const transformedData = response.data.map((event: any) => ({
        id: event._id,
        name: event.purpose,
        residentName: event.residentName,
        date: new Date(event.date).toLocaleDateString(),
        time: event.time.split(":").slice(0, 2).join(":"),
        icon: "calendar-check",
        creatorId: event.id,
      }));
      setEvents(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: any) => {
    const confirm = window.confirm("Do you want to Delete");
    if (confirm) {
      try {
        await axios.delete(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/event/delete-event/${id}`);
        getAllEvents();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setLoggedInUserId(userId);
    };

    fetchUserId();
    getAllEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}> Society Events</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addEventButton}
          onPress={() => router.push("/screen/Resident/BookEventForm")} // ✅ Expo Router navigation
        >
          <MaterialCommunityIcons name="plus" style={styles.addEventButtonIcon} />
          <Text style={styles.addEventButtonText}>Add New Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Events..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredEvents.slice(0, 20)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <MaterialCommunityIcons name={item.icon} style={styles.eventIcon} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>
                {item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
              </Text>
              <Text style={styles.eventDate}>{item.residentName}</Text>
              <Text style={styles.eventDate}>📆 {item.date}</Text>
              <Text style={styles.eventTime}>⏰ {item.time}</Text>
              {loggedInUserId === item.creatorId && (
                <Text style={styles.eventDelete} onPress={() => handleDelete(item.id)}>
                  <DeleteIcon />{" "}
                </Text>
              )}
            </View>
          </View>
        )}
      />

      {events.length === 0 && <Text style={styles.noEventsText}>No upcoming events found</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#EFF3F6" },
  pageTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "#333" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  addEventButton: {
    backgroundColor: "#143bcf",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  addEventButtonIcon: { color: "Black", fontSize: 20, marginRight: 5 },
  addEventButtonText: { color: "Black", fontWeight: "bold", fontSize: 16 },
  searchContainer: {
    flexDirection: "row",
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
  searchIcon: { fontSize: 22, color: "#666", marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  eventIcon: { fontSize: 35, color: "#684f7d", marginRight: 15 },
  eventInfo: { flex: 1 },
  eventName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  eventDate: { fontSize: 14, color: "#666", marginTop: 2 },
  eventTime: { fontSize: 14, color: "#666", marginTop: 2 },
  eventDelete: { fontSize: 14, color: "red", marginTop: -20, right: -200 },
  noEventsText: { textAlign: "center", color: "#666", marginTop: 20 },
});

export default EventList;
