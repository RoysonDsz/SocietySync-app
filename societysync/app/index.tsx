
import { View, Text, StyleSheet } from "react-native";
import Cards from "./screen/Cards"; // Import Cards Page



export default function Home() {
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Society Sync</Text>
      <Cards /> {/* Render Cards Component */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
