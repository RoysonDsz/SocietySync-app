import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { PlusCircle, Pencil, Trash2, Phone, Mail } from 'lucide-react-native';

type Block = {
  name: string;
};

type Resident = {
  id: string;
  name: string;
  flat: string;
  block: string;
  phone?: string;
  email?: string;
};

type Building = {
  id: string;
  name: string;
  blocks: Block[];
};

const ResidentList = ({ route, navigation }: any) => {
  const { building }: { building: Building } = route.params;

  // Resident state
  const [residents, setResidents] = useState<Resident[]>([
    { id: '1', name: 'Alice Brown', flat: 'A-101', block: 'A', phone: '1234567890', email: 'alice@example.com' },
    { id: '2', name: 'Bob Smith', flat: 'A-102', block: 'A', phone: '0987654321', email: 'bob@example.com' },
    { id: '3', name: 'Charlie Johnson', flat: 'B-201', block: 'B', phone: '9876543210', email: 'charlie@example.com' },
    { id: '4', name: 'David White', flat: 'B-202', block: 'B', phone: '8765432109', email: 'david@example.com' },
    { id: '5', name: 'Emma Green', flat: 'C-301', block: 'C', phone: '7654321098', email: 'emma@example.com' }
  ]);
  
  // Get a filtered list of residents that belong to this building
  const buildingResidents = residents.filter((r) => 
    building.blocks.some((b: Block) => b.name === r.block)
  );

  // Handle navigating to generate bills page
  const handleGenerateBill = (resident: Resident) => {
    navigation.navigate('GenerateBills', { resident });
  };

  // Handle making a phone call
  const handlePhoneCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  // Handle sending an email
  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Handle adding a new resident
  const handleAddResident = () => {
    if (building.blocks.length === 0) {
      Alert.alert(
        "No Blocks Available",
        "Please add blocks to this building before adding residents.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate('ManageResident', { 
      building,
      selectedBlock: building.blocks[0].name,
      onSave: (newResident: Resident) => {
        const newId = (residents.length > 0 ? Math.max(...residents.map(r => parseInt(r.id))) + 1 : 1).toString();
        setResidents([...residents, { ...newResident, id: newId }]);
      }
    });
  };

  // Handle editing a resident
  const handleEditResident = (resident: Resident) => {
    navigation.navigate('ManageResident', { 
      building,
      resident,
      onSave: (updatedResident: Resident) => {
        setResidents(residents.map(r => r.id === updatedResident.id ? updatedResident : r));
      }
    });
  };

  // Handle deleting a resident
  const handleDeleteResident = (resident: Resident) => {
    Alert.alert(
      "Delete Resident",
      `Are you sure you want to delete ${resident.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => setResidents(residents.filter(r => r.id !== resident.id)),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Residents in {building.name}</Text>
      
      <FlatList
        data={buildingResidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleGenerateBill(item)}
            style={styles.residentCard}
          >
            <View style={styles.residentInfo}>
              <Text style={styles.residentName}>{item.name}</Text>
              <Text style={styles.flatInfo}>Flat: {item.flat} | Block: {item.block}</Text>
              
              {item.phone && (
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    handlePhoneCall(item.phone!);
                  }}
                  style={styles.contactRow}
                >
                  <Phone size={16} color="#3a86ff" />
                  <Text style={styles.contactInfo}>{item.phone}</Text>
                </TouchableOpacity>
              )}
              
              {item.email && (
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEmail(item.email!);
                  }}
                  style={styles.contactRow}
                >
                  <Mail size={16} color="#3a86ff" />
                  <Text style={styles.contactInfo}>{item.email}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent's onPress
                  handleEditResident(item);
                }} 
                style={styles.editButton}
              >
                <Pencil size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent's onPress
                  handleDeleteResident(item);
                }} 
                style={styles.deleteButton}
              >
                <Trash2 size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No residents found for this building.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddResident}>
        <PlusCircle size={22} color="white" />
        <Text style={styles.addButtonText}>Add Resident</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  residentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  flatInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  contactInfo: {
    fontSize: 14,
    color: '#3a86ff',
    marginLeft: 6
  },
  actionButtons: {
    flexDirection: 'row'
  },
  editButton: {
    backgroundColor: '#4cc9f0',
    padding: 8,
    borderRadius: 6,
    marginRight: 6
  },
  deleteButton: {
    backgroundColor: '#ef476f',
    padding: 8,
    borderRadius: 6
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4361ee',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#666'
  }
});

export default ResidentList;