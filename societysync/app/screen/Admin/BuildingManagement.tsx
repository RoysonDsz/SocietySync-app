import axios from 'axios';
import {
  Building,
  Pencil,
  Shield,
  Trash,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Picker } from 'react-native';
import AddBuilding from './AddBuilding';

// Define the building type based on backend response
interface BuildingType {
  _id: string;
  buildingName: string;
  buildingNumber: string;
  location: string;
  numberOfFlats: string;
  ownerName: string;
  presidentName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const BuildingManagement = ({ navigation }: any) => {
  const [activeFooter, setActiveFooter] = useState('Buildings');
  const [modalVisible, setModalVisible] = useState(false);
  const [presidentModalVisible, setPresidentModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
  const [editedFlats, setEditedFlats] = useState(''); // Changed from BlockA/BlockB to single flats
  const [presidentName, setPresidentName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [loading, setLoading] = useState(false);

  const getAllBuildings = async () => {
    try {
      const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/building/`);
      setBuildings(response.data); // Update state with response data
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBuildings();
  }, []);

  useEffect(() => {
    if (presidentModalVisible && selectedBuilding) {
      fetchResidents();
    }
  }, [presidentModalVisible, selectedBuilding]);

  const fetchResidents = async () => {
    if (!selectedBuilding) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/assign/${id}/residents?buildingId=${selectedBuilding._id}`);
      setResidents(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch residents.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (building: BuildingType) => {
    setSelectedBuilding(building);
    setEditedFlats(building.numberOfFlats);
    setModalVisible(true);
  };

  const handleAssignPresident = (building: BuildingType) => {
    setSelectedBuilding(building);
    setPresidentName(building.presidentName || '');
    setIsAdmin(false);
    setSelectedResident('');
    setPresidentModalVisible(true);
  };

  const assignPresident = async () => {
    if (!selectedResident) {
      Alert.alert('Error', 'Please select a resident.');
      return;
    }
    
    try {
      await axios.patch(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/user/assign-president`, { 
        id: selectedResident 
      });
      
      Alert.alert(
        'President Assigned',
        'President assigned successfully!',
        [{ 
          text: 'OK',
          onPress: () => {
            setPresidentModalVisible(false);
            getAllBuildings(); // Refresh building list to show updated president
          }
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to assign president.');
      console.log(error);
    }
  };

  const handleDelete = async(buildingId: string) => {
    try {
      await axios.delete(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/building/delete/${buildingId}`);
      getAllBuildings();
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async () => {
    if (!selectedBuilding) return;
    
    try {
      await axios.patch(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/building/update/${selectedBuilding._id}`, {
        numberOfFlats: editedFlats
      });
      
      getAllBuildings(); // Refresh the buildings list
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update building information.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <Text style={styles.title}>Building Management</Text>
          <View style={styles.headerAccent}></View>
        </View>
      </View>
      
      <AddBuilding onAdd={(newBuilding: BuildingType) => setBuildings([newBuilding, ...buildings])} />
      
      <FlatList
        data={buildings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.buildingCard}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                style={styles.buildingButton}
                onPress={() => navigation.navigate('BuildingPage', { building: item._id })}
              >
                <Text style={styles.buildingName}>{item.buildingName}</Text>
                <View style={styles.buildingInfo}>
                  <Building size={14} color="#555" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{item.numberOfFlats} Flats</Text>
                </View>
                {item.presidentName ? (
                  <View style={styles.presidentInfoContainer}>
                    <User size={14} color={item.isAdmin ? "#4361ee" : "#3a86ff"} style={styles.infoIcon} />
                    <Text style={[styles.presidentInfo, item.isAdmin && styles.adminText]}>
                      President: {item.presidentName} {item.isAdmin && '(Admin)'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.presidentInfoContainer}>
                    <User size={14} color="#aaa" style={styles.infoIcon} />
                    <Text style={styles.noPresidentText}>No president assigned</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  onPress={() => handleAssignPresident(item)} 
                  style={[styles.actionButton, styles.assignButton]}
                >
                  <User size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleEdit(item)} 
                  style={[styles.actionButton, styles.editButton]}
                >
                  <Pencil size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDelete(item._id)} 
                  style={[styles.actionButton, styles.deleteButton]}
                >
                  <Trash size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Edit Modal - Modified to edit total flats instead of blocks */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Building</Text>
              <View style={styles.modalDivider}></View>
            </View>
            <Text style={styles.inputLabel}>Number of Flats:</Text>
            <TextInput
              value={editedFlats}
              onChangeText={setEditedFlats}
              keyboardType="number-pad"
              style={styles.input}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign President Modal */}
      <Modal visible={presidentModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign President</Text>
              <View style={styles.modalDivider}></View>
            </View>
            {selectedBuilding && (
              <View style={styles.buildingNameContainer}>
                <Building size={18} color="#3a86ff" />
                <Text style={styles.modalBuildingName}>{selectedBuilding.buildingName}</Text>
              </View>
            )}
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3a86ff" />
                <Text style={styles.loadingText}>Loading residents...</Text>
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Text style={styles.inputLabel}>Select Resident:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedResident}
                    onValueChange={(value) => setSelectedResident(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Resident" value="" />
                    {residents.map(resident => (
                      <Picker.Item 
                        key={resident._id} 
                        label={resident.name} 
                        value={resident._id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
            
            <View style={styles.adminToggleContainer}>
              <View style={styles.adminLabelContainer}>
                <Shield size={18} color="#4361ee" style={styles.adminIcon} />
                <Text style={styles.adminToggleLabel}>Grant Admin Rights</Text>
              </View>
              <Switch
                value={isAdmin}
                onValueChange={setIsAdmin}
                trackColor={{ false: '#eee', true: '#c7d2fe' }}
                thumbColor={isAdmin ? '#4361ee' : '#f4f3f4'}
                ios_backgroundColor="#eee"
              />
            </View>
            
            {isAdmin && (
              <View style={styles.adminInfoContainer}>
                <Text style={styles.adminInfoText}>
                  Admin presidents can edit building information and manage resident accounts.
                </Text>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setPresidentModalVisible(false)} 
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={assignPresident} 
                style={[styles.saveButton, !selectedResident && styles.disabledButton]} 
                disabled={!selectedResident}
              >
                <Text style={styles.saveButtonText}>Assign President</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles remain the same but with additions for new elements
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f8' 
  },
  header: {
    backgroundColor: '#4361ee',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    paddingBottom: 25,
    position: 'relative',
  },
  headerAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#3a86ff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 90
  },
  buildingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
  },
  buildingButton: { 
    flex: 1,
    padding: 16,
    borderLeftWidth: 8,
    borderLeftColor: '#4895ef',
  },
  buildingName: { 
    color: '#333', 
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6
  },
  buildingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  infoIcon: {
    marginRight: 6
  },
  infoText: {
    color: '#555',
    fontSize: 14
  },
  presidentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  presidentInfo: {
    color: '#3a86ff',
    fontSize: 14,
    fontWeight: '500'
  },
  adminText: {
    color: '#4361ee',
    fontWeight: 'bold'
  },
  noPresidentText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic'
  },
  actionButtonsContainer: { 
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderLeftWidth: 1,
    borderLeftColor: '#eee'
  },
  actionButton: { 
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  assignButton: {
    backgroundColor: '#3a86ff',
  },
  editButton: {
    backgroundColor: '#4cc9f0',
  },
  deleteButton: {
    backgroundColor: '#ef476f',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    backgroundColor: '#4361ee',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  modalDivider: {
    height: 2,
    backgroundColor: '#3a86ff',
    marginTop: 12,
    width: '20%',
    alignSelf: 'center',
    borderRadius: 2
  },
  buildingNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalBuildingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8
  },
  inputLabel: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#4361ee'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    color: '#333'
  },
  adminToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff'
  },
  adminLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  adminIcon: {
    marginRight: 8
  },
  adminToggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4361ee'
  },
  adminInfoContainer: {
    backgroundColor: '#e0e7ff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4361ee'
  },
  adminInfoText: {
    color: '#4361ee',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4361ee',
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  disabledButton: {
    backgroundColor: '#c7d2fe',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee'
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonActive: {
    backgroundColor: '#e0edff',
    borderTopWidth: 3,
    borderTopColor: '#4361ee',
  },
  footerButtonText: {
    marginTop: 4,
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  footerButtonTextActive: {
    color: '#4361ee',
    fontWeight: 'bold',
  },
  
  // New styles for resident picker
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#3a86ff',
    fontWeight: '500',
  }
});

export default BuildingManagement;