import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Switch,
  Alert,
  Modal,
  FlatList,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define types
interface Resident {
  id: string;
  name: string;
  flatNumber: string;
  phoneNumber: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isUrgent: boolean;
  timestamp: string;
  sentTo: string[]; // Array of resident IDs
  sentByPresident: boolean;
}

// Dummy residents data
const dummyResidents: Resident[] = [
  { id: '1', name: 'John Smith', flatNumber: 'A101', phoneNumber: '555-123-4567' },
  { id: '2', name: 'Sarah Johnson', flatNumber: 'A102', phoneNumber: '555-234-5678' },
  { id: '3', name: 'Michael Brown', flatNumber: 'A201', phoneNumber: '555-345-6789' },
  { id: '4', name: 'Emily Davis', flatNumber: 'A202', phoneNumber: '555-456-7890' },
  { id: '5', name: 'Robert Wilson', flatNumber: 'B101', phoneNumber: '555-567-8901' },
  { id: '6', name: 'Jennifer Lee', flatNumber: 'B102', phoneNumber: '555-678-9012' },
  { id: '7', name: 'David Martinez', flatNumber: 'B201', phoneNumber: '555-789-0123' },
  { id: '8', name: 'Lisa Taylor', flatNumber: 'B202', phoneNumber: '555-890-1234' },
  { id: '9', name: 'Thomas Anderson', flatNumber: 'C101', phoneNumber: '555-901-2345' },
  { id: '10', name: 'Jessica White', flatNumber: 'C102', phoneNumber: '555-012-3456' },
  { id: '11', name: 'Daniel Clark', flatNumber: 'C201', phoneNumber: '555-123-4567' },
  { id: '12', name: 'Michelle Lewis', flatNumber: 'C202', phoneNumber: '555-234-5678' },
  { id: '13', name: 'James Walker', flatNumber: 'D101', phoneNumber: '555-345-6789' },
  { id: '14', name: 'Patricia Allen', flatNumber: 'D102', phoneNumber: '555-456-7890' },
  { id: '15', name: 'Richard Young', flatNumber: 'D201', phoneNumber: '555-567-8901' },
  { id: '16', name: 'Karen Harris', flatNumber: 'D202', phoneNumber: '555-678-9012' },
];

// Sample notifications for demonstration
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Water Supply Interruption',
    message: 'Due to maintenance work, water supply will be interrupted tomorrow from 10 AM to 2 PM. Please store water accordingly.',
    isUrgent: true,
    timestamp: '2025-03-22T09:30:00.000Z',
    sentTo: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
    sentByPresident: true
  },
  {
    id: '2',
    title: 'Monthly Association Meeting',
    message: 'Reminder for our monthly association meeting this Saturday at 6 PM in the community hall. Agenda includes discussion on new security measures and garden renovation.',
    isUrgent: false,
    timestamp: '2025-03-20T15:45:00.000Z',
    sentTo: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
    sentByPresident: true
  }
];

const BroadcastSystem: React.FC<{ residents?: Resident[], presidentName?: string }> = ({ 
  residents = dummyResidents, // Use dummy residents as default
  presidentName = "Maria Rodriguez" // Provide default president name
}) => {
  // State for notification being created
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [showResidentSelector, setShowResidentSelector] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  // State for notification history
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [showHistory, setShowHistory] = useState(false);
  
  // Handle select all residents
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(residents.map(resident => resident.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Handle toggling a single resident selection
  const toggleResident = (residentId: string) => {
    if (selectedResidents.includes(residentId)) {
      setSelectedResidents(selectedResidents.filter(id => id !== residentId));
      setSelectAll(false);
    } else {
      setSelectedResidents([...selectedResidents, residentId]);
      if (selectedResidents.length + 1 === residents.length) {
        setSelectAll(true);
      }
    }
  };
  
  // Send notification
  const sendNotification = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a notification title");
      return;
    }
    
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a notification message");
      return;
    }
    
    if (selectedResidents.length === 0) {
      Alert.alert("Error", "Please select at least one resident");
      return;
    }
    
    // Create new notification object
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      isUrgent,
      timestamp: new Date().toISOString(),
      sentTo: [...selectedResidents],
      sentByPresident: true
    };
    
    // Add to notifications history
    setNotifications([newNotification, ...notifications]);
    
    // In a real app, here you would make API calls to send SMS, push notifications, emails, etc.
    
    // Show success message
    Alert.alert(
      "Success", 
      `Presidential announcement sent to ${selectedResidents.length} resident${selectedResidents.length > 1 ? 's' : ''}`
    );
    
    // Reset form
    resetForm();
  };
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setMessage('');
    setIsUrgent(false);
    setIsPinned(false);
    setSelectedResidents([]);
    setSelectAll(false);
  };
  
  // Get resident name by ID
  const getResidentName = (id: string): string => {
    const resident = residents.find(r => r.id === id);
    return resident ? resident.name : 'Unknown';
  };
  
  // Get count of selected residents by building/block
  const getSelectionSummary = (): string => {
    if (selectedResidents.length === 0) {
      return "No residents selected";
    }
    
    if (selectedResidents.length === residents.length) {
      return "All residents selected";
    }
    
    // Group by building/block (first character of flat number)
    const blocks: Record<string, number> = {};
    
    selectedResidents.forEach(id => {
      const resident = residents.find(r => r.id === id);
      if (resident) {
        const block = resident.flatNumber.charAt(0);
        blocks[block] = (blocks[block] || 0) + 1;
      }
    });
    
    return Object.entries(blocks)
      .map(([block, count]) => `Block ${block}: ${count}`)
      .join(", ");
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Presidential Broadcast</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => setShowHistory(true)}
        >
          <MaterialCommunityIcons name="history" size={24} color="#fff" />
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.presidentInfo}>
        <View style={styles.presidentAvatar}>
          <MaterialCommunityIcons name="account-tie" size={36} color="#fff" />
        </View>
        <View style={styles.presidentDetails}>
          <Text style={styles.presidentName}>{presidentName}</Text>
          <Text style={styles.presidentTitle}>President, Resident Association</Text>
        </View>
      </View>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Presidential Announcement</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter announcement title"
              maxLength={50}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your announcement here..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.optionsContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Mark as Urgent</Text>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: "#ccc", true: "#FAD2D0" }}
                thumbColor={isUrgent ? "#F44336" : "#fff"}
              />
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Pin to Notice Board</Text>
              <Switch
                value={isPinned}
                onValueChange={setIsPinned}
                trackColor={{ false: "#ccc", true: "#E1F5FE" }}
                thumbColor={isPinned ? "#0288D1" : "#fff"}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Recipients</Text>
          
          <View style={styles.recipientSummary}>
            <Text style={styles.recipientCount}>
              Selected: {selectedResidents.length} of {residents.length} residents
            </Text>
            <Text style={styles.recipientDistribution}>
              {getSelectionSummary()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleSelectAll}
          >
            <MaterialCommunityIcons name="account-group" size={24} color="#2196F3" />
            <Text style={styles.quickActionButtonText}>
              {selectAll ? "Deselect All Residents" : "Select All Residents"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.recipientSelector}
            onPress={() => setShowResidentSelector(true)}
          >
            <MaterialCommunityIcons name="account-multiple-check" size={24} color="#2196F3" />
            <Text style={styles.recipientSelectorText}>Manage Individual Recipients</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={resetForm}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.sendButton,
              isUrgent ? styles.urgentButton : null,
              (selectedResidents.length === 0 || !title || !message) ? styles.disabledButton : null
            ]}
            onPress={sendNotification}
            disabled={selectedResidents.length === 0 || !title || !message}
          >
            <MaterialCommunityIcons name={isUrgent ? "alert" : "send"} size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.sendButtonText}>
              {isUrgent ? 'Send Urgent Announcement' : 'Send Announcement'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Resident Selector Modal */}
      <Modal
        visible={showResidentSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResidentSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Recipients</Text>
              <TouchableOpacity onPress={() => setShowResidentSelector(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.selectAllContainer}
              onPress={handleSelectAll}
            >
              <MaterialCommunityIcons 
                name={selectAll ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={24} 
                color="#2196F3" 
              />
              <Text style={styles.selectAllText}>Select All Residents</Text>
            </TouchableOpacity>
            
            <FlatList
              data={residents}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.residentsList}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.residentItem}
                  onPress={() => toggleResident(item.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <MaterialCommunityIcons 
                      name={selectedResidents.includes(item.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
                      size={24} 
                      color="#2196F3" 
                    />
                  </View>
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{item.name}</Text>
                    <Text style={styles.residentFlat}>Flat: {item.flatNumber}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={() => setShowResidentSelector(false)}
              >
                <Text style={styles.confirmButtonText}>
                  Confirm ({selectedResidents.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Notification History Modal */}
      <Modal
        visible={showHistory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Presidential Announcements</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {notifications.length === 0 ? (
              <View style={styles.emptyHistory}>
                <MaterialCommunityIcons name="bell-off-outline" size={48} color="#ccc" />
                <Text style={styles.emptyHistoryText}>No announcements sent yet</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.notificationsList}
                renderItem={({ item }) => (
                  <View style={[
                    styles.notificationItem,
                    item.isUrgent ? styles.urgentNotification : null
                  ]}>
                    {item.isUrgent && (
                      <View style={styles.urgentBadge}>
                        <MaterialCommunityIcons name="alert" size={16} color="#fff" />
                        <Text style={styles.urgentBadgeText}>URGENT</Text>
                      </View>
                    )}
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <View style={styles.notificationMeta}>
                      <Text style={styles.notificationDate}>
                        {formatTimestamp(item.timestamp)}
                      </Text>
                      <Text style={styles.notificationRecipients}>
                        Sent to {item.sentTo.length} resident{item.sentTo.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                )}
              />
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a237e', // Darker blue for presidential
    paddingHorizontal: 24,
    paddingVertical: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  presidentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3949ab',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  presidentAvatar: {
    backgroundColor: '#283593',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  presidentDetails: {
    flex: 1,
  },
  presidentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  presidentTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  optionsContainer: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recipientSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recipientCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  recipientDistribution: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  quickActionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 12,
  },
  recipientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  recipientSelectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#3F51B5', // More presidential blue
    flexDirection: 'row',
    flex: 3,
    marginLeft: 12,
  },
  urgentButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
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
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  residentsList: {
    paddingBottom: 16,
  },
  residentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  confirmButton: {
    backgroundColor: '#3F51B5',
    width: '100%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsList: {
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  urgentNotification: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  urgentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#F44336',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginRight: 80, // Space for the urgent badge
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  notificationDate: {
    fontSize: 14,
    color: '#777',
  },
  notificationRecipients: {
    fontSize: 14,
    color: '#777',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#777',
    marginTop: 16,
  },
});

// Sample App component to demonstrate usage
const App = () => {
  return (
    <BroadcastSystem 
      residents={dummyResidents}
      presidentName="Maria Rodriguez"
    />
  );
};

export default BroadcastSystem;