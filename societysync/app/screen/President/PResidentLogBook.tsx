import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Linking, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Resident {
  id: string;
  name: string;
  flatNumber: string;
  phoneNumber: string;
  photo: string;
}

const PResidentLogBook: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageModeIsEdit, setManageModeIsEdit] = useState(false);
  
  // Form state for adding/editing residents
  const [residentForm, setResidentForm] = useState<Omit<Resident, 'id'>>({
    name: '',
    flatNumber: '',
    phoneNumber: '',
    photo: ''
  });

  // Sample resident data - now as state so we can modify it
  const [residents, setResidents] = useState<Resident[]>([
    { id: '1', name: 'John Smith', flatNumber: 'A-101', phoneNumber: '9876543210', photo: 'https://example.com/photo1.jpg' },
    { id: '2', name: 'Maria Garcia', flatNumber: 'B-205', phoneNumber: '9876543211', photo: 'https://example.com/photo2.jpg' },
    { id: '3', name: 'Raj Patel', flatNumber: 'C-302', phoneNumber: '9876543212', photo: 'https://example.com/photo3.jpg' },
    { id: '4', name: 'Sarah Johnson', flatNumber: 'A-103', phoneNumber: '9876543213', photo: 'https://example.com/photo4.jpg' },
    { id: '5', name: 'Robert Fox', flatNumber: 'D-401', phoneNumber: '9876543214', photo: 'https://example.com/photo5.jpg' },
  ]);

  // Function to call resident
  const callResident = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Function to open add resident modal
  const openAddResidentModal = () => {
    setResidentForm({
      name: '',
      flatNumber: '',
      phoneNumber: '',
      photo: ''
    });
    setManageModeIsEdit(false);
    setShowManageModal(true);
  };

  // Function to open edit resident modal
  const openEditResidentModal = (resident: Resident) => {
    setResidentForm({
      name: resident.name,
      flatNumber: resident.flatNumber,
      phoneNumber: resident.phoneNumber,
      photo: resident.photo
    });
    setSelectedResident(resident);
    setManageModeIsEdit(true);
    setShowManageModal(true);
  };

  // Function to handle form input changes
  const handleFormChange = (field: keyof Omit<Resident, 'id'>, value: string) => {
    setResidentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to save resident (add or update)
  const saveResident = () => {
    // Basic validation
    if (!residentForm.name || !residentForm.flatNumber || !residentForm.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (manageModeIsEdit && selectedResident) {
      // Update existing resident
      const updatedResidents = residents.map(r => 
        r.id === selectedResident.id 
          ? { ...r, ...residentForm } 
          : r
      );
      setResidents(updatedResidents);
      Alert.alert('Success', 'Resident updated successfully');
    } else {
      // Add new resident with a unique ID
      const newId = (Math.max(...residents.map(r => parseInt(r.id))) + 1).toString();
      const newResident: Resident = {
        id: newId,
        ...residentForm
      };
      setResidents([...residents, newResident]);
      Alert.alert('Success', 'Resident added successfully');
    }
    setShowManageModal(false);
  };

  // Function to delete resident - Enhanced to ensure it works correctly
  const deleteResident = (id: string) => {
    if (!id) {
      console.error("Delete called with invalid ID");
      return;
    }
    
    Alert.alert(
      'Delete Resident',
      'Are you sure you want to remove this resident?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            try {
              // Filter out the resident with matching ID
              const updatedResidents = residents.filter(resident => resident.id !== id);
              
              // Log for debugging
              console.log(`Deleting resident with ID: ${id}`);
              console.log(`Before: ${residents.length} residents, After: ${updatedResidents.length} residents`);
              
              // Update the state with the filtered array
              setResidents(updatedResidents);
              
              // Close the modal
              setShowResidentModal(false);
              
              // Clear the selected resident
              setSelectedResident(null);
              
              // Show success message
              Alert.alert('Success', 'Resident removed successfully');
            } catch (error) {
              console.error("Error deleting resident:", error);
              Alert.alert('Error', 'Failed to delete resident. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Function to render each resident item
  const renderResidentItem = ({ item }: { item: Resident }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => {
        setSelectedResident(item);
        setShowResidentModal(true);
      }}
    >
      <View style={styles.listItemContent}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSubtitle}>Flat: {item.flatNumber}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.iconButton, styles.callButton]}
          onPress={() => callResident(item.phoneNumber)}
        >
          <MaterialCommunityIcons name="phone" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, styles.editButton]}
          onPress={() => openEditResidentModal(item)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Filter residents based on search query
  const filteredResidents = residents.filter(resident => 
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.flatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search and Add Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search residents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddResidentModal}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Resident List */}
      {residents.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="account-off" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No residents found</Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={openAddResidentModal}>
            <Text style={styles.emptyStateButtonText}>Add Resident</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredResidents}
          renderItem={renderResidentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Resident Details Modal */}
      <Modal
        visible={showResidentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResidentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resident Details</Text>
              <TouchableOpacity onPress={() => setShowResidentModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {selectedResident && (
              <View style={styles.residentDetailContainer}>
                <View style={styles.residentAvatar}>
                  <Text style={styles.residentAvatarText}>{selectedResident.name.charAt(0)}</Text>
                </View>
                <Text style={styles.residentName}>{selectedResident.name}</Text>
                
                <View style={styles.residentDetailsCards}>
                  <View style={styles.contactCard}>
                    <MaterialCommunityIcons name="home" size={22} color="#333" style={styles.contactCardIcon} />
                    <Text style={styles.contactCardTitle}>Flat Number</Text>
                    <Text style={styles.contactCardValue}>{selectedResident.flatNumber}</Text>
                  </View>
                  <View style={styles.contactCard}>
                    <MaterialCommunityIcons name="phone" size={22} color="#333" style={styles.contactCardIcon} />
                    <Text style={styles.contactCardTitle}>Phone Number</Text>
                    <Text style={styles.contactCardValue}>{selectedResident.phoneNumber}</Text>
                  </View>
                </View>
                
                <View style={styles.residentActions}>
                  <TouchableOpacity 
                    style={styles.residentActionCard}
                    onPress={() => {
                      callResident(selectedResident.phoneNumber);
                      setShowResidentModal(false);
                    }}
                  >
                    <View style={[styles.residentActionIcon, {backgroundColor: '#e3f2fd'}]}>
                      <MaterialCommunityIcons name="phone" size={24} color="#1976d2" />
                    </View>
                    <Text style={styles.residentActionText}>Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.residentActionCard}
                    onPress={() => {
                      setShowResidentModal(false);
                      openEditResidentModal(selectedResident);
                    }}
                  >
                    <View style={[styles.residentActionIcon, {backgroundColor: '#fff9c4'}]}>
                      <MaterialCommunityIcons name="pencil" size={24} color="#fbc02d" />
                    </View>
                    <Text style={styles.residentActionText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.residentActionCard}
                    onPress={() => deleteResident(selectedResident.id)}
                    testID="deleteResidentButton" // Added for testing
                  >
                    <View style={[styles.residentActionIcon, {backgroundColor: '#ffebee'}]}>
                      <MaterialCommunityIcons name="delete" size={24} color="#c62828" />
                    </View>
                    <Text style={styles.residentActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Add/Edit Resident Modal */}
      <Modal
        visible={showManageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManageModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <ScrollView contentContainerStyle={styles.modalScrollView}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {manageModeIsEdit ? 'Edit Resident' : 'Add New Resident'}
                </Text>
                <TouchableOpacity onPress={() => setShowManageModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter resident name"
                    value={residentForm.name}
                    onChangeText={(value) => handleFormChange('name', value)}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Flat Number *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. A-101"
                    value={residentForm.flatNumber}
                    onChangeText={(value) => handleFormChange('flatNumber', value)}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Phone Number *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter phone number"
                    value={residentForm.phoneNumber}
                    onChangeText={(value) => handleFormChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Photo URL (Optional)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter photo URL"
                    value={residentForm.photo}
                    onChangeText={(value) => handleFormChange('photo', value)}
                  />
                </View>

                {/* Form actions */}
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={[styles.formButton, styles.cancelButton]}
                    onPress={() => setShowManageModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.formButton, styles.saveButton]}
                    onPress={saveResident}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24, // Added padding to prevent overlap with status bar
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24, // Added padding bottom for list items
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000', // Added shadow for better visual hierarchy
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Added flex to ensure proper layout
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#cfd8dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#f5f5f5',
  },
  callButton: {
    backgroundColor: '#e8f5e9',
  },
  editButton: {
    backgroundColor: '#fff9c4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalScrollView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24, // Added margin for spacing
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  residentDetailContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  residentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#cfd8dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  residentAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  residentName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  residentDetailsCards: {
    width: '100%',
    marginBottom: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactCardIcon: {
    marginRight: 16,
  },
  contactCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  contactCardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  residentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  residentActionCard: {
    alignItems: 'center',
    width: '33%',
  },
  residentActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  residentActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Add/Edit Form styles
  formContainer: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  formButton: {
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1976d2',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PResidentLogBook;