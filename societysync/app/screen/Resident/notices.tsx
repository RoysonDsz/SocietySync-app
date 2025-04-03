import axios from 'axios';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const NoticesScreen: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getNotices = async () => {
    try {
      const response = await axios.get(`https://vt92g6tf-5050.inc1.devtunnels.ms/api/notification/get`);
      console.log(response.data.notifications || []);
      if (!response.data || !response.data.notifications || response.data.notifications.length === 0) {
        setMessage('No updates.');
      } else {
        setNotices(response.data.notifications || []);
      }
    } catch (error) {
      console.error('There was an error!', error);
      setError('Something went wrong!');
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔔 Notices</Text>

      {/* Show the message if no notices are available */}
      {message && <Text style={styles.message}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={notices}
        keyExtractor={(item) => item._id} // Use _id as the unique key
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.name}>{item.name}</Text> {/* Display the 'name' */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EFF3F6",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF", // Dark blue for visibility
  },
  date: {
    fontSize: 12,
    color: "#6B7280", // Gray for subtlety
    marginVertical: 2,
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
  },
  name: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "bold",
  },
  error: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
  },
});

export default NoticesScreen;
