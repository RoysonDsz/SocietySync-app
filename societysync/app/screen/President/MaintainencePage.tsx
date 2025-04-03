import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Static list of residents (replace with your own data)
const staticResidents = [
  { id: '1', name: 'John Doe', flatNumber: '101' },
  { id: '2', name: 'Jane Smith', flatNumber: '102' },
  { id: '3', name: 'Alice Johnson', flatNumber: '103' },
  { id: '4', name: 'Bob Brown', flatNumber: '104' },
];

const MaintenancePage = ({ 
  presidentName = "Maria Rodriguez" // Provide default president name
}) => {
  const [residents, setResidents] = useState(staticResidents); // Use static residents
  const [selectedResidents, setSelectedResidents] = useState([]);
  const [showResidentSelector, setShowResidentSelector] = useState(false);
  const [amounts, setAmounts] = useState({});
  const [selectionMode, setSelectionMode] = useState('individual'); // 'all' or 'individual'
  const [bulkAmount, setBulkAmount] = useState('');
  const [individualFixedAmount, setIndividualFixedAmount] = useState('');

  // Toggle selection mode between 'all' and 'individual'
  const toggleSelectionMode = (mode) => {
    setSelectionMode(mode);
    
    // If switching to 'all' mode, select all residents
    if (mode === 'all') {
      const allResidents = residents.map(resident => ({
        id: resident.id,
        name: resident.name,
        flatNumber: resident.flatNumber
      }));
      setSelectedResidents(allResidents);
      applyAmountToAll(bulkAmount);
    } else {
      // If switching to 'individual' mode, clear all selections
      setSelectedResidents([]);
      setAmounts({});
      setIndividualFixedAmount('');
    }
  };

  // Handle toggling a resident selection
  const toggleResident = (resident) => {
    const isCurrentlySelected = selectedResidents.some(r => r.id === resident.id);
    
    if (isCurrentlySelected) {
      // Remove just this resident
      setSelectedResidents(selectedResidents.filter(r => r.id !== resident.id));
      
      // Also remove the amount for this resident
      const newAmounts = {...amounts};
      delete newAmounts[resident.id];
      setAmounts(newAmounts);
    } else {
      // Add just this resident
      setSelectedResidents([...selectedResidents, { 
        id: resident.id,
        name: resident.name,
        flatNumber: resident.flatNumber
      }]);
      
      // If there's a fixed amount set, apply it to the newly selected resident
      if (individualFixedAmount !== '' && !isNaN(parseFloat(individualFixedAmount))) {
        handleAmountChange(resident.id, parseFloat(individualFixedAmount));
      }
    }
  };

  // Handle updating the amount for a specific resident only
  const handleAmountChange = (residentId, amount) => {
    setAmounts(prevAmounts => ({
      ...prevAmounts,
      [residentId]: amount
    }));
  };

  // Apply fixed amount to all selected residents in individual mode
  const applyFixedAmountToSelected = () => {
    if (individualFixedAmount === '' || isNaN(parseFloat(individualFixedAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    
    const amount = parseFloat(individualFixedAmount);
    const newAmounts = {...amounts};
    
    selectedResidents.forEach(resident => {
      newAmounts[resident.id] = amount;
    });
    
    setAmounts(newAmounts);
  };

  // Apply the same amount to all selected residents
  const applyAmountToAll = (amount) => {
    if (isNaN(amount) || amount === '') return;
    
    const newAmounts = {};
    selectedResidents.forEach(resident => {
      newAmounts[resident.id] = amount;
    });
    setAmounts(newAmounts);
  };

  // Update the resident list with amount information
  const updateResidentsWithAmounts = () => {
    // Check if amounts are set for all selected residents
    const missingAmounts = selectedResidents.filter(
      resident => !amounts[resident.id] && amounts[resident.id] !== 0
    );
    
    if (missingAmounts.length > 0) {
      Alert.alert(
        "Missing Amounts",
        "Please set amounts for all selected residents",
        [{ text: "OK" }]
      );
      return;
    }
    
    const updatedResidents = selectedResidents.map(resident => ({
      ...resident,
      amount: amounts[resident.id] || 0
    }));
    
    // Preserve the individual amounts when updating residents
    setSelectedResidents(updatedResidents);
    setShowResidentSelector(false);
  };

  // Remove a single resident from the selection in the main page
  const removeResident = (residentId) => {
    setSelectedResidents(selectedResidents.filter(r => r.id !== residentId));
    
    // Also remove the amount for this resident
    const newAmounts = {...amounts};
    delete newAmounts[residentId];
    setAmounts(newAmounts);
  };

  // Handle sending payments to all selected residents
  const handleSendToAll = () => {
    // Check if all selected residents have amounts
    const missingAmounts = selectedResidents.filter(
      resident => !amounts[resident.id] && amounts[resident.id] !== 0
    );
    
    if (missingAmounts.length > 0) {
      Alert.alert(
        "Missing Amounts",
        "Please set amounts for all selected residents",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Construct payment data
    const paymentData = selectedResidents.map(resident => ({
      residentId: resident.id,
      amount: amounts[resident.id],
      flatNumber: resident.flatNumber
    }));
    
    // Show success message (in a real app, you would send this to your API)
    Alert.alert(
      "Success",
      `Payment request sent to ${selectedResidents.length} residents`,
      [
        { 
          text: "OK", 
          onPress: () => {
            // Reset the form
            setSelectedResidents([]);
            setAmounts({});
          } 
        }
      ]
    );
    
    console.log("Payment data:", paymentData);
    // Here you would typically send the data to your API
    // axios.post('your-api-endpoint', paymentData)...
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Maintenance Page</Text>
      
      <TouchableOpacity 
        style={styles.recipientSelector}
        onPress={() => setShowResidentSelector(true)}
      >
        <MaterialCommunityIcons name="account-multiple-check" size={24} color="#4CAF50" />
        <Text style={styles.recipientSelectorText}>Select Residents and Set Amount</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <Text style={styles.summaryText}>Selected Residents: {selectedResidents.length}</Text>
      {selectedResidents.length > 0 ? (
        <>
          <FlatList
            data={selectedResidents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.residentItem}>
                <View style={styles.residentInfo}>
                  <Text style={styles.residentName}>{item.name}</Text>
                  <Text style={styles.residentFlat}>Flat {item.flatNumber}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <TextInput
                    style={styles.mainPageAmountInput}
                    value={amounts[item.id]?.toString() || '0'}
                    keyboardType="numeric"
                    placeholder="Amount (₹)"
                    onChangeText={(value) => {
                      const amount = parseFloat(value);
                      if (!isNaN(amount) || value === '') {
                        // Only update this specific resident's amount
                        handleAmountChange(item.id, value === '' ? 0 : amount);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeResident(item.id)}
                  >
                    <MaterialCommunityIcons name="close-circle" size={22} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleSendToAll}
            >
              <Text style={styles.actionButtonText}>Send To All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setSelectedResidents([]);
                setAmounts({});
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noResidentsText}>No residents selected.</Text>
      )}

      {/* Resident Selector Modal */}
      <Modal
        visible={showResidentSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResidentSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Residents</Text>

            {/* Selection Mode Toggle */}
            <View style={styles.selectionModeContainer}>
              <TouchableOpacity
                style={[styles.selectionModeButton, selectionMode === 'all' && styles.selectionModeButtonActive]}
                onPress={() => toggleSelectionMode('all')}
              >
                <Text style={[styles.selectionModeText, selectionMode === 'all' && styles.selectionModeTextActive]}>
                  Select All Residents
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.selectionModeButton, selectionMode === 'individual' && styles.selectionModeButtonActive]}
                onPress={() => toggleSelectionMode('individual')}
              >
                <Text style={[styles.selectionModeText, selectionMode === 'individual' && styles.selectionModeTextActive]}>
                  Select Individual Residents
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bulk Amount Setting - All Mode */}
            {selectionMode === 'all' && (
              <View style={styles.bulkAmountContainer}>
                <Text style={styles.bulkAmountLabel}>Set Amount for All:</Text>
                <TextInput
                  style={styles.bulkAmountInput}
                  keyboardType="numeric"
                  placeholder="Enter Amount (₹)"
                  value={bulkAmount}
                  onChangeText={(value) => {
                    setBulkAmount(value);
                    const amount = parseFloat(value);
                    if (!isNaN(amount)) {
                      applyAmountToAll(amount);
                    }
                  }}
                />
              </View>
            )}

            {/* Fixed Amount Setting - Individual Mode */}
            {selectionMode === 'individual' && (
              <View style={styles.fixedAmountContainer}>
                <TextInput
                  style={styles.fixedAmountInput}
                  keyboardType="numeric"
                  placeholder="Fixed Amount for Selected (₹)"
                  value={individualFixedAmount}
                  onChangeText={setIndividualFixedAmount}
                />
                <TouchableOpacity
                  style={styles.applyFixedButton}
                  onPress={applyFixedAmountToSelected}
                >
                  <Text style={styles.applyFixedButtonText}>Apply to Selected</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Resident List */}
            <FlatList
              data={residents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedResidents.some(resident => resident.id === item.id);
                return (
                  <View style={styles.residentListItem}>
                    <TouchableOpacity
                      style={styles.residentCheckSection}
                      onPress={() => {
                        if (selectionMode === 'individual') {
                          toggleResident(item);
                        }
                      }}
                      disabled={selectionMode === 'all'}
                    >
                      <View style={styles.checkboxContainer}>
                        <MaterialCommunityIcons
                          name={isSelected 
                            ? 'checkbox-marked' 
                            : 'checkbox-blank-outline'}
                          size={24}
                          color={isSelected ? "#4CAF50" : 
                                (selectionMode === 'individual' ? "#aaaaaa" : "#aaaaaa")}
                        />
                      </View>
                      <View style={styles.residentInfo}>
                        <Text style={styles.residentName}>{item.name}</Text>
                        <Text style={styles.residentFlat}>Flat {item.flatNumber}</Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Individual Amount Input - Only show for selected residents */}
                    {(isSelected) && (
                      <View style={styles.amountContainer}>
                        <TextInput
                          style={styles.amountInput}
                          value={amounts[item.id]?.toString() || ''}
                          keyboardType="numeric"
                          placeholder="Amount (₹)"
                          onChangeText={(value) => {
                            const amount = parseFloat(value);
                            if (!isNaN(amount) || value === '') {
                              // Update only this specific resident's amount
                              handleAmountChange(item.id, value === '' ? '' : amount);
                            }
                          }}
                          editable={true}
                        />
                      </View>
                    )}
                  </View>
                );
              }}
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={updateResidentsWithAmounts}
              >
                <Text style={styles.confirmButtonText}>Confirm Selection</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelModalButton]}
                onPress={() => setShowResidentSelector(false)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  recipientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  recipientSelectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#00796b',
    marginLeft: 12,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#00796b',
    marginBottom: 8,
  },
  noResidentsText: {
    fontSize: 16,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 8,
  },
  residentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  residentFlat: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  amountContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 120,
  },
  mainPageAmountInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  selectionModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectionModeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectionModeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  selectionModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  selectionModeTextActive: {
    color: '#fff',
  },
  bulkAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  bulkAmountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  bulkAmountInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 150,
  },
  fixedAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  fixedAmountInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  applyFixedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyFixedButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelModalButton: {
    backgroundColor: '#f44336',
    marginRight: 0,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 0,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  residentListItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  residentCheckSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  }
});

export default MaintenancePage;