import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  RefreshControl
} from 'react-native';
import axios from 'axios';

// API Base URL (replace with your actual backend URL)
const API_BASE_URL = 'https://mrnzp03x-8080.inc1.devtunnels.ms/api/visitors';

// Visitor Interface
interface Visitor {
  _id?: string;
  name: string;
  phone: string;
  purpose: string;
  flatNo: string;
  checkIn?: string;
  checkOut?: string | null;
  status: 'checked-in' | 'checked-out';
}

// Visitor Management System Component
const VisitorManagementSystem: React.FC = () => {
  // Screen width for responsive design
  const windowWidth = Dimensions.get('window').width;

  // State Management
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showAddVisitorForm, setShowAddVisitorForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // New Visitor Form State
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    phone: "",
    purpose: "",
    flatNo: ""
  });

  // Fetch Visitors from Backend
  const fetchVisitors = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${API_BASE_URL}/visitors`, {
        params: { search: searchTerm }
      });
      setVisitors(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch visitors');
    } finally {
      setRefreshing(false);
    }
  };

  // Lifecycle Effect for Fetching Visitors
  useEffect(() => {
    fetchVisitors();
  }, [searchTerm]);

  // Input Change Handler
  const handleInputChange = (value: string, field: keyof typeof newVisitor) => {
    setNewVisitor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add Visitor Handler
  const handleAddVisitor = async () => {
    // Input Validation
    if (!newVisitor.name || !newVisitor.phone || !newVisitor.purpose || !newVisitor.flatNo) {
      Alert.alert("Missing Information", "Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/visitors`, newVisitor);
      
      // Reset Form
      setNewVisitor({
        name: "",
        phone: "",
        purpose: "",
        flatNo: ""
      });
      setShowAddVisitorForm(false);
      
      // Refresh Visitors
      fetchVisitors();
    } catch (error) {
      Alert.alert('Error', 'Could not add visitor');
    }
  };

  // Check Out Visitor Handler
  const handleCheckOut = async (id: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/visitors/${id}/checkout`);
      fetchVisitors();
      setSelectedVisitor(null);
    } catch (error) {
      Alert.alert('Error', 'Could not check out visitor');
    }
  };

  // Delete Visitor Handler
  const handleDeleteVisitor = async (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this visitor record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/visitors/${id}`);
              fetchVisitors();
              setSelectedVisitor(null);
            } catch (error) {
              Alert.alert('Error', 'Could not delete visitor');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Date Formatting Utility
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Render Visitor Row
  const renderVisitorRow = ({ item }: { item: Visitor }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.phone}</Text>
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.flatNo}</Text>
      <View style={[styles.tableCell, { flex: 1.5 }]}>
        <View style={[
          styles.statusBadge, 
          item.status === "checked-in" ? styles.checkedInBadge : styles.checkedOutBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status === "checked-in" ? "In" : "Out"}
          </Text>
        </View>
      </View>
      <View style={[styles.tableCell, { flex: 1.5 }]}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setSelectedVisitor(item)}
        >
          <Text>👁️</Text>
        </TouchableOpacity>
        {item.status === "checked-in" && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleCheckOut(item._id!)}
          >
            <Text>⬇️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Visitor Management</Text>

      {/* Search and Add Visitor Section */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search visitors..."
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddVisitorForm(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Visitors List */}
      <FlatList
        data={visitors}
        renderItem={renderVisitorRow}
        keyExtractor={(item) => item._id || ''}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchVisitors}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No visitors found</Text>
          </View>
        }
      />

      {/* Add Visitor Modal */}
      <Modal
        visible={showAddVisitorForm}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Visitor</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Name"
              value={newVisitor.name}
              onChangeText={(text) => handleInputChange(text, 'name')}
            />
            <TextInput 
              style={styles.input}
              placeholder="Phone"
              value={newVisitor.phone}
              onChangeText={(text) => handleInputChange(text, 'phone')}
              keyboardType="phone-pad"
            />
            <TextInput 
              style={styles.input}
              placeholder="Purpose"
              value={newVisitor.purpose}
              onChangeText={(text) => handleInputChange(text, 'purpose')}
            />
            <TextInput 
              style={styles.input}
              placeholder="Flat Number"
              value={newVisitor.flatNo}
              onChangeText={(text) => handleInputChange(text, 'flatNo')}
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

      {/* Visitor Details Modal */}
      <Modal
        visible={!!selectedVisitor}
        transparent={true}
        animationType="slide"
      >
        {selectedVisitor && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Visitor Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text>{selectedVisitor.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text>{selectedVisitor.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Flat:</Text>
                <Text>{selectedVisitor.flatNo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Purpose:</Text>
                <Text>{selectedVisitor.purpose}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check In:</Text>
                <Text>{formatDateTime(selectedVisitor.checkIn || null)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text>{selectedVisitor.status}</Text>
              </View>

              <View style={styles.modalButtonContainer}>
                {selectedVisitor.status === 'checked-in' && (
                  <TouchableOpacity 
                    style={styles.modalCheckOutButton}
                    onPress={() => handleCheckOut(selectedVisitor._id!)}
                  >
                    <Text style={styles.modalButtonText}>Check Out</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.modalDeleteButton}
                  onPress={() => handleDeleteVisitor(selectedVisitor._id!)}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setSelectedVisitor(null)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

// Styles
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
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  tableCell: {
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  checkedInBadge: {
    backgroundColor: '#e6f7e6',
  },
  checkedOutBadge: {
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  emptyListContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    color: '#888',
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
  modalCheckOutButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#d9534f',
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
  detailRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 100,
  },
});

export default VisitorManagementSystem;