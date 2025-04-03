import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

// Screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Colors from Emergency Response component
const primaryBlue = '#180DC9';
const primaryCyan = '#06D9E0';

// API Base URL
const API_BASE_URL = 'https://vt92g6tf-5050.inc1.devtunnels.ms/api/visitor';

// TypeScript Interfaces
interface Visitor {
  _id: string;
  visitorName: string;
  visitorPhoneNumber: string;
  purpose: string;
  flatNumber: string;
  checkIn?: string;
  checkOut?: string | null;
  status: 'checked-in' | 'checked-out';
  additionalNotes?: string;
  createdAt: string;
}

interface NewVisitorForm {
  visitorName: string;
  visitorPhoneNumber: string;
  purpose: string;
  flatNumber: string;
  additionalNotes?: string;
  otherPurpose?: string;
  buildingNumber: string; // Added buildingNumber to the form data
}

// purpose options
const purposeOptions = ['Visitor', 'Delivery', 'Medical', 'Other'];

const VisitorManagementSystem: React.FC = () => {
  // State Management
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'checked-in' | 'checked-out'>('all');
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [newVisitor, setNewVisitor] = useState<NewVisitorForm>({
    visitorName: '',
    visitorPhoneNumber: '',
    purpose: '',
    flatNumber: '',
    additionalNotes: '',
    buildingNumber: '' // Initialize buildingNumber
  });

  // Fetch visitors on component mount
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Fetch Visitors from Backend
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get-visitor`);
      
      // Transform backend data format to match our app's format
      const transformedVisitors = response.data.response.map((visitor: any) => ({
        _id: visitor._id,
        visitorName: visitor.visitorName,
        visitorPhoneNumber: visitor.visitorPhoneNumber,
        purpose: visitor.purpose,
        flatNumber: visitor.flatNumber,
        status: visitor.checkOut ? 'checked-out' : 'checked-in',
        checkIn: visitor.createdAt,
        checkOut: visitor.checkOut,
        additionalNotes: visitor.additionalNotes || '',
        createdAt: visitor.createdAt
      }));
      
      setVisitors(transformedVisitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      Alert.alert('Error', 'Could not fetch visitors from the server');
    } finally {
      setLoading(false);
    }
  };

  // Form Steps Configuration
  const formSteps = [
    {
      field: 'visitorName',
      label: 'Visitor Name',
      placeholder: 'Enter visitor name',
      keyboardType: 'default',
      validation: (value: string) => value.trim().length > 0
    },
    {
      field: 'visitorPhoneNumber',
      label: 'Phone Number',
      placeholder: 'Enter phone number',
      keyboardType: 'phone-pad',
      validation: (value: string) => /^\d{10}$/.test(value.replace(/\D/g, ''))
    },
    {
      field: 'flatNumber',
      label: 'Flat Number',
      placeholder: 'Enter flat number',
      keyboardType: 'default',
      validation: (value: string) => value.trim().length > 0
    },
    {
      field: 'buildingNumber', // Added buildingNumber field
      label: 'Building Number', // Building number label
      placeholder: 'Enter building number',
      keyboardType: 'default',
      validation: (value: string) => value.trim().length > 0
    },
    {
      field: 'purpose',
      label: 'Purpose of Visit',
      placeholder: 'Select purpose',
      keyboardType: 'default',
      validation: (value: string) => value.trim().length > 0
    },
  ];

  // Handler for New Visitor Input
  const handleNewVisitorChange = (value: string) => {
    const currentStep = formSteps[currentFormStep];
    
    // Special handling for purpose step
    if (currentStep.field === 'purpose') {
      setNewVisitor({
        ...newVisitor,
        purpose: value,
        otherPurpose: value === 'Other' ? newVisitor.otherPurpose : ''
      });
    } else {
      setNewVisitor({
        ...newVisitor,
        [currentStep.field]: value
      });
    }
  };

  // Handler for Other Purpose Input
  const handleOtherPurposeChange = (value: string) => {
    setNewVisitor({
      ...newVisitor,
      otherPurpose: value
    });
  };

  // Close Add Visitor Form Handler - Updated
  const handleCloseAddVisitorForm = () => {
    // If no data has been entered, simply close the form
    const isFormEmpty = 
      !newVisitor.visitorName && 
      !newVisitor.visitorPhoneNumber && 
      !newVisitor.flatNumber && 
      !newVisitor.purpose &&
      !newVisitor.buildingNumber; // Check if building number is provided

    if (isFormEmpty) {
      setIsEditing(false);
      setCurrentFormStep(0);
      return;
    }

    // Show a confirmation dialog before closing
    Alert.alert(
      'Cancel Adding Visitor',
      'Are you sure you want to cancel adding this visitor? All entered information will be lost.',
      [
        {
          text: 'Continue Editing',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            // Reset form state
            setNewVisitor({
              visitorName: '',
              visitorPhoneNumber: '',
              purpose: '',
              flatNumber: '',
              additionalNotes: '',
              buildingNumber: '' // Reset building number as well
            });
            setCurrentFormStep(0);
            setIsEditing(false);
          }
        }
      ]
    );
  };

  // Navigation and Validation for Form Steps
  const handleNextStep = () => {
    const currentStep = formSteps[currentFormStep];
    const currentValue = newVisitor[currentStep.field as keyof NewVisitorForm];

    if (currentStep.field === 'purpose') {
      if (newVisitor.purpose === 'Other' && (!newVisitor.otherPurpose || newVisitor.otherPurpose.trim() === '')) {
        Alert.alert("Invalid Input", "Please specify the purpose");
        return;
      }
    }

    if (!currentStep.validation(currentValue as string)) {
      Alert.alert("Invalid Input", `Please enter a valid ${currentStep.label}`);
      return;
    }

    if (currentFormStep < formSteps.length - 1) {
      setCurrentFormStep(currentFormStep + 1);
    } else {
      handleAddVisitor();
    }
  };

  // Add New Visitor
  const handleAddVisitor = async () => {
    try {
      // Format the visitor data for the API
      const visitorData = {
        visitorName: newVisitor.visitorName,
        visitorPhoneNumber: newVisitor.visitorPhoneNumber,
        purpose: newVisitor.purpose === 'Other' ? newVisitor.otherPurpose || '' : newVisitor.purpose,
        flatNumber: newVisitor.flatNumber,
        buildingNumber: newVisitor.buildingNumber, // Include buildingNumber in the request
        additionalNotes: newVisitor.additionalNotes || ''
      };

      // Send POST request to the backend
      const response = await axios.post(`${API_BASE_URL}/add-visitor`, visitorData);
      
      if (response.data.success) {
        // Refresh the visitors list
        fetchVisitors();
        
        // Reset form
        setNewVisitor({
          visitorName: '',
          visitorPhoneNumber: '',
          purpose: '',
          flatNumber: '',
          additionalNotes: '',
          buildingNumber: '' // Reset building number as well
        });
        setCurrentFormStep(0);
        setIsEditing(false);
        
        Alert.alert('Success', 'Visitor added successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add visitor');
      }
    } catch (error) {
      console.error('Error adding visitor:', error);
      Alert.alert('Error', 'Failed to add visitor. Please try again.');
    }
  };

  // Toggle Visitor Status (Check-in/Check-out)
  const handleToggleStatus = async (visitor: Visitor) => {
    try {
      if (visitor.status === 'checked-in') {
        // Check out the visitor
        const response = await axios.put(`${API_BASE_URL}/check-out/${visitor._id}`);
        
        if (response.data.success) {
          // Update local state
          setVisitors(prevVisitors =>
            prevVisitors.map(v =>
              v._id === visitor._id 
                ? { 
                    ...v, 
                    status: 'checked-out',
                    checkOut: new Date().toISOString()
                  } 
                : v
            )
          );
        } else {
          Alert.alert('Error', response.data.message || 'Failed to check-out visitor');
        }
      } else {
        // Since we can't re-check in visitors via API, we'll refresh the list
        Alert.alert('Information', 'Checked-out visitors cannot be checked back in');
      }
    } catch (error) {
      console.error('Error toggling visitor status:', error);
      Alert.alert('Error', 'Failed to update visitor status');
    }
  };

  // Delete Visitor
  const handleDeleteVisitor = async (visitor: Visitor) => {
    Alert.alert(
      'Delete Visitor',
      `Are you sure you want to delete ${visitor.visitorName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_BASE_URL}/delete-visitor/${visitor._id}`);
              
              if (response.data.success) {
                setVisitors(prevVisitors => prevVisitors.filter(v => v._id !== visitor._id));
                Alert.alert('Success', 'Visitor deleted successfully');
              } else {
                Alert.alert('Error', response.data.message || 'Failed to delete visitor');
              }
            } catch (error) {
              console.error('Error deleting visitor:', error);
              Alert.alert('Error', 'Failed to delete visitor');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  // Filtering Visitors
  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      visitor.visitorPhoneNumber.includes(searchTerm) ||
      visitor.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterType === 'all' || 
      visitor.status === filterType;
    
    return matchesSearch && matchesStatus;
  });

  // Show Visitor Details
  const handleVisitorDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsDetailsModalVisible(true);
  };

  // Format Date for Display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  return (
    <LinearGradient
      colors={[primaryCyan, primaryBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[primaryCyan, primaryBlue]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>Visitor Management</Text>
        </LinearGradient>

        {/* Search and Filter Section */}
        <View style={styles.filterBar}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search visitors..."
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          
          {/* Filter Buttons */}
          <View style={styles.filterButtons}>
            {['All', 'In', 'Out'].map((type) => (
              <TouchableOpacity 
                key={type}
                style={[ 
                  styles.filterButton, 
                  (
                    (type === 'All' && filterType === 'all') || 
                    (type === 'In' && filterType === 'checked-in') || 
                    (type === 'Out' && filterType === 'checked-out')
                  ) && styles.activeFilterButton
                ]}
                onPress={() => {
                  switch(type) {
                    case 'All': setFilterType('all'); break;
                    case 'In': setFilterType('checked-in'); break;
                    case 'Out': setFilterType('checked-out'); break;
                  }
                }}
              >
                <Text style={[ 
                  styles.filterButtonText, 
                  (
                    (type === 'All' && filterType === 'all') || 
                    (type === 'In' && filterType === 'checked-in') || 
                    (type === 'Out' && filterType === 'checked-out')
                  ) && styles.activeFilterText
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Visitors List */}
        <View style={styles.visitorsSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Visitors ({filteredVisitors.length})</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryBlue} />
              <Text style={styles.loadingText}>Loading visitors...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredVisitors}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => handleVisitorDetails(item)}
                  style={styles.visitorRow}
                >
                  <View style={styles.visitorDetails}>
                    <Text style={styles.visitorName}>{item.visitorName}</Text>
                    <Text style={styles.visitorInfo}>
                      {item.flatNumber} • {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                    </Text>
                  </View>
                  {item.status === 'checked-in' && (
                    <TouchableOpacity 
                      style={[styles.checkButton, styles.checkOutButton]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(item);
                      }}
                    >
                      <Text style={styles.checkButtonText}>Check Out</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === 'checked-out' && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      
                      onPress={() =>{console.log('Delete button pressed for visitor:', item); handleDeleteVisitor(item)}}
                    >
                      <Text style={styles.trashIcon}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No visitors found</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Visitor Details Modal */}
        <Modal
          visible={isDetailsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsDetailsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailsModalContent}>
              {selectedVisitor && (
                <>
                  <Text style={styles.detailsModalTitle}>{selectedVisitor.visitorName}</Text>
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsLabel}>Phone Number</Text>
                    <Text style={styles.detailsValue}>{selectedVisitor.visitorPhoneNumber}</Text>
                  </View>
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsLabel}>Flat Number</Text>
                    <Text style={styles.detailsValue}>{selectedVisitor.flatNumber}</Text>
                  </View>
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsLabel}>Purpose</Text>
                    <Text style={styles.detailsValue}>{selectedVisitor.purpose}</Text>
                  </View>
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsLabel}>Check-In Time</Text>
                    <Text style={styles.detailsValue}>
                      {formatDate(selectedVisitor.checkIn || selectedVisitor.createdAt)}
                    </Text>
                  </View>
                  {selectedVisitor.checkOut && (
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailsLabel}>Check-Out Time</Text>
                      <Text style={styles.detailsValue}>
                        {formatDate(selectedVisitor.checkOut)}
                      </Text>
                    </View>
                  )}
                  {selectedVisitor.additionalNotes && (
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailsLabel}>Additional Notes</Text>
                      <Text style={styles.detailsValue}>{selectedVisitor.additionalNotes}</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.closeDetailsButton}
                    onPress={() => setIsDetailsModalVisible(false)}
                  >
                    <Text style={styles.closeDetailsButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Add Visitor Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            setIsEditing(true);
            setCurrentFormStep(0);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        {/* Add Visitor Modal */}
        <Modal
          visible={isEditing}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseAddVisitorForm}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeModalButtonContainer}
                onPress={handleCloseAddVisitorForm}
                activeOpacity={0.7}
              >
                <View style={styles.closeModalButton}>
                  <Text style={styles.closeModalButtonText}>✕</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New Visitor</Text>
              <Text style={styles.stepIndicator}>
                Step {currentFormStep + 1} of {formSteps.length}
              </Text>
              
              {/* Purpose Step with Dropdown */}
              {formSteps[currentFormStep].field === 'purpose' ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Purpose of Visit</Text>
                  {purposeOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[ 
                        styles.dropdownOption, 
                        newVisitor.purpose === option && styles.selectedDropdownOption
                      ]}
                      onPress={() => {
                        setNewVisitor({
                          ...newVisitor,
                          purpose: option,
                          otherPurpose: option === 'Other' ? newVisitor.otherPurpose : ''
                        });
                      }}
                    >
                      <Text style={[ 
                        styles.dropdownOptionText, 
                        newVisitor.purpose === option && styles.selectedDropdownOptionText 
                      ]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                  
                  {newVisitor.purpose === 'Other' && (
                    <TextInput 
                      style={styles.otherPurposeInput}
                      value={newVisitor.otherPurpose}
                      onChangeText={handleOtherPurposeChange}
                      placeholder="Specify other purpose"
                    />
                  )}
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {formSteps[currentFormStep].label}
                  </Text>
                  <TextInput 
                    style={styles.input}
                    value={newVisitor[formSteps[currentFormStep].field as keyof NewVisitorForm] as string}
                    onChangeText={handleNewVisitorChange}
                    placeholder={formSteps[currentFormStep].placeholder}
                    keyboardType={formSteps[currentFormStep].keyboardType as any}
                    autoFocus={true}
                  />
                </View>
              )}
              
              <View style={styles.modalButtons}>
                {currentFormStep > 0 && (
                  <TouchableOpacity 
                    style={styles.cancelModalButton}
                    onPress={() => setCurrentFormStep(currentFormStep - 1)}
                  >
                    <Text style={styles.cancelModalButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.saveModalButton}
                  onPress={handleNextStep}
                >
                  <Text style={styles.saveModalButtonText}>
                    {currentFormStep < formSteps.length - 1 ? 'Next' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#fff',
  },
  filterBar: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 14,
    backgroundColor: '#f9f9f9'
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    fontSize: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#0078D7',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  visitorsSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  visitorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  visitorDetails: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  visitorInfo: {
    color: '#666',
    fontSize: 12,
  },
  checkButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
  },
  checkOutButton: {
    backgroundColor: '#F44336',
  },
  checkButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelModalButton: {
    flex: 1,
    marginRight: 10,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  saveModalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveModalButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  detailsModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  detailsModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  detailsSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  detailsLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  detailsValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  closeDetailsButton: {
    marginTop: 15,
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeDetailsButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeModalButtonContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  closeModalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  closeModalButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  dropdownOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedDropdownOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dropdownOptionText: {
    textAlign: 'center',
    color: '#333',
  },
  selectedDropdownOptionText: {
    color: 'white',
  },
  otherPurposeInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  trashIcon: {
    fontSize: 20,
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    color: '#666',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  }
});

export default VisitorManagementSystem;
