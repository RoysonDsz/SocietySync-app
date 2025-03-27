import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Resident {
  id: string;
  name: string;
  flatNumber: string;
  phoneNumber: string;
  photo: string;
}

const ResidentLogBook: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showResidentModal, setShowResidentModal] = useState(false);

  // Sample resident data
  const residents: Resident[] = [
    { id: '1', name: 'John Smith', flatNumber: 'A-101', phoneNumber: '9876543210', photo: 'https://example.com/photo1.jpg' },
    { id: '2', name: 'Maria Garcia', flatNumber: 'B-205', phoneNumber: '9876543211', photo: 'https://example.com/photo2.jpg' },
    { id: '3', name: 'Raj Patel', flatNumber: 'C-302', phoneNumber: '9876543212', photo: 'https://example.com/photo3.jpg' },
    { id: '4', name: 'Sarah Johnson', flatNumber: 'A-103', phoneNumber: '9876543213', photo: 'https://example.com/photo4.jpg' },
    { id: '5', name: 'Robert Fox', flatNumber: 'D-401', phoneNumber: '9876543214', photo: 'https://example.com/photo5.jpg' },
  ];

  // Function to call resident
  const callResident = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons  name="magnify" size={20} color="#666" style={styles.searchIcon} />
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

      {/* Resident List */}
      <FlatList
        data={filteredResidents}
        renderItem={renderResidentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

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
                      <MaterialCommunityIcons  name="phone" size={24} color="#1976d2" />
                    </View>
                    <Text style={styles.residentActionText}>Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 12, // Added margin bottom for spacing
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24, // Added padding bottom for list items
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
    paddingBottom: 40,
    maxHeight: '80%',
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
    width: '45%',
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
});

export default ResidentLogBook;
 