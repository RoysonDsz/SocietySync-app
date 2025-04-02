import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Linking, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Colors
  const primaryBlue = '#180DC9';
  const primaryCyan = '#06D9E0';

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
        <LinearGradient
          colors={[primaryBlue, primaryCyan]}
          style={styles.avatarContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </LinearGradient>
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSubtitle}>Flat: {item.flatNumber}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.iconButtonContainer}
          onPress={() => callResident(item.phoneNumber)}
        >
          <LinearGradient
            colors={[primaryBlue, primaryCyan]}
            style={styles.iconButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#fff" />
          </LinearGradient>
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
    <LinearGradient
      colors={[primaryCyan, primaryBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Updated Header with LinearGradient */}
          <LinearGradient
            colors={[primaryCyan, primaryBlue]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>Residents LogBook</Text>
          </LinearGradient>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search residents..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
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
                    <LinearGradient
                      colors={[primaryBlue, primaryCyan]}
                      style={styles.residentAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.residentAvatarText}>{selectedResident.name.charAt(0)}</Text>
                    </LinearGradient>
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
                        <LinearGradient
                          colors={['#e3f2fd', '#bbdefb']}
                          style={styles.residentActionIcon}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MaterialCommunityIcons name="phone" size={24} color={primaryBlue} />
                        </LinearGradient>
                        <Text style={styles.residentActionText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingTop: 0, // Remove top padding
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingTop: 0, // Remove top padding
  },
  // Updated header styles to ensure it extends to the top of the screen
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 40, // Adjust for status bar
  },
  headerTitle: {
    fontSize: 22,
    textAlign:'center',
    fontWeight: 'bold',
    marginTop:-'20',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonContainer: {
    marginLeft: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  residentDetailContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  residentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  residentAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  residentName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eeeeee',
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
    color: '#333',
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
    color: '#180DC9',
  },
});

export default ResidentLogBook;