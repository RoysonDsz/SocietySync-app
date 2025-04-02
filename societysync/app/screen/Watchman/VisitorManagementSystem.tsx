import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'https://mrnzp03x-8080.inc1.devtunnels.ms/api/visitor';

// Visitor Interface
interface Visitor {
  _id?: string;
  visitorName: string;
  visitorPhoneNumber: string;
  purpose: string;
  flatNumber: string;
  createdAt?: string;
}

// Visitor Management System Component
const VisitorManagementSystem: React.FC = () => {
  // State Management
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [showAddVisitorForm, setShowAddVisitorForm] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: "",
    visitorPhoneNumber: "",
    purpose: "",
    flatNumber: ""
  });

  // Fetch Visitors from Backend
  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/visitor/get-visitor`);
      setVisitors(response.data.response);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch visitors');
    }
  };

  // Lifecycle Effect for Fetching Visitors
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Input Change Handler
  const handleInputChange = (value: string, field: keyof typeof newVisitor) => {
    setNewVisitor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add Visitor Handler
  const handleAddVisitor = async () => {
    if (!newVisitor.visitorName || !newVisitor.visitorPhoneNumber || 
        !newVisitor.purpose || !newVisitor.flatNumber) {
      Alert.alert("Missing Information", "Please fill all fields");
      return;
    }

    try {
      await axios.post(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/visitor/create`, newVisitor);
      setNewVisitor({
        visitorName: "",
        visitorPhoneNumber: "",
        purpose: "",
        flatNumber: ""
      });
      setShowAddVisitorForm(false);
      fetchVisitors();
    } catch (error) {
      Alert.alert('Error', 'Could not add visitor');
    }
  };

  // Render Visitor Row
  const renderVisitorRow = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorItem}>
      <Text style={styles.visitorName}>{item.visitorName}</Text>
      <Text style={styles.visitorDetail}>Phone: {item.visitorPhoneNumber}</Text>
      <Text style={styles.visitorDetail}>Flat: {item.flatNumber}</Text>
      <Text style={styles.visitorDetail}>Purpose: {item.purpose}</Text>
      {item.createdAt && (
        <Text style={styles.visitorDetail}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Visitor Management</Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddVisitorForm(true)}
      >
        <Text style={styles.addButtonText}>Add New Visitor</Text>
      </TouchableOpacity>

      <FlatList
        data={visitors}
        renderItem={renderVisitorRow}
        keyExtractor={(item) => item._id!}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No visitors found</Text>
          </View>
        }
      />

      <Modal
        visible={showAddVisitorForm}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Visitor</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Visitor Name"
              value={newVisitor.visitorName}
              onChangeText={(text) => handleInputChange(text, 'visitorName')}
            />
            <TextInput 
              style={styles.input}
              placeholder="Phone Number"
              value={newVisitor.visitorPhoneNumber}
              onChangeText={(text) => handleInputChange(text, 'visitorPhoneNumber')}
              keyboardType="phone-pad"
            />
            <TextInput 
              style={styles.input}
              placeholder="Purpose of Visit"
              value={newVisitor.purpose}
              onChangeText={(text) => handleInputChange(text, 'purpose')}
            />
            <TextInput 
              style={styles.input}
              placeholder="Flat Number"
              value={newVisitor.flatNumber}
              onChangeText={(text) => handleInputChange(text, 'flatNumber')}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowAddVisitorForm(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitButton}
                onPress={handleAddVisitor}
              >
                <Text style={styles.modalButtonText}>Add Visitor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitorItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  visitorDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: '#888',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  modalCancelButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalSubmitButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VisitorManagementSystem;