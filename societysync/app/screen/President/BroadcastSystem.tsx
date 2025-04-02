import React, { useState, useEffect } from 'react';
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
  FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

// Primary colors from ComplaintsPage
const primaryBlue = '#180DC9';
const primaryCyan = '#06D9E0';

// Dummy building ID for fetching residents (you can replace this with the actual building ID as needed)
const currentBuildingId = 'A'; // Assuming we are fetching for Building A

const BroadcastSystem: React.FC<{ presidentName?: string }> = ({ 
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
  const [notifications, setNotifications] = useState<any[]>([]); // Adjusted type for notifications
  const [showHistory, setShowHistory] = useState(false);
  
  // State for residents and loading state
  const [residents, setResidents] = useState<any[]>([]); // Adjusted type for residents
  const [loadingResidents, setLoadingResidents] = useState(true);

  useEffect(() => {
    // Fetch residents from backend based on current building ID
    axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/user/users`)
      .then(response => {
        setResidents(response.data);
        setLoadingResidents(false); // Stop loading once residents are fetched
      })
      .catch(error => {
        console.error('Error fetching residents:', error);
        setLoadingResidents(false); // Stop loading in case of an error
      });

    // Fetch notifications when the component is mounted
    axios.get('https://mrnzp03x-5050.inc1.devtunnels.ms/api/notification/get')
      .then(response => {
        setNotifications(response.data.notifications);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

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

  // Send notification to backend
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

    // Send the notification to the backend
    axios.post('https://mrnzp03x-5050.inc1.devtunnels.ms/api/notification/create', {
      name:presidentName,
      role:'President',
      title: title.trim(),
      message: message.trim(),
      sentTo: selectedResidents,
    })
    .then(response => {
      Alert.alert("Success", `Notification sent successfully to ${selectedResidents.length} resident${selectedResidents.length > 1 ? 's' : ''}`);
      resetForm(); // Reset the form after sending the notification
    })
    .catch(error => {
      Alert.alert("Error", "There was an error sending the notification.");
      console.error('Error sending notification:', error);
    });
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
    <LinearGradient
      colors={[primaryCyan, primaryBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header with Title and History Button */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[primaryCyan, primaryBlue]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Presidential Broadcast</Text>
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => setShowHistory(true)}
              >
                <MaterialCommunityIcons name="history" size={18} color="#fff" />
                <Text style={styles.historyButtonText}>History</Text>
              </TouchableOpacity>
            </View>

            {/* President Info Section */}
            <View style={styles.presidentInfo}>
              <View style={styles.presidentAvatar}>
                <MaterialCommunityIcons name="account" size={32} color="#fff" />
              </View>
              <View style={styles.presidentDetails}>
                <Text style={styles.presidentName}>{presidentName}</Text>
                <Text style={styles.presidentTitle}>Building President</Text>
              </View>
            </View>
          </LinearGradient>
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

          {/* Resident Selector */}
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
              <MaterialCommunityIcons name="account-group" size={24} color={primaryBlue} />
              <Text style={styles.quickActionButtonText}>
                {selectAll ? "Deselect All Residents" : "Select All Residents"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.recipientSelector}
              onPress={() => setShowResidentSelector(true)}
            >
              <MaterialCommunityIcons name="account-multiple-check" size={24} color={primaryBlue} />
              <Text style={styles.recipientSelectorText}>Manage Individual Recipients</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={primaryBlue} />
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
                  color={primaryBlue}
                />
                <Text style={styles.selectAllText}>Select All Residents</Text>
              </TouchableOpacity>

              <FlatList
                data={residents}
                style={styles.residentsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.residentItem}
                    onPress={() => toggleResident(item.id)}
                  >
                    <View style={styles.checkboxContainer}>
                      <MaterialCommunityIcons
                        name={
                          selectedResidents.includes(item.id)
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                        size={24}
                        color={primaryBlue}
                      />
                    </View>
                    <View style={styles.residentInfo}>
                      <Text style={styles.residentName}>{item.name}</Text>
                      <Text style={styles.residentFlat}>Flat {item.flatNumber}</Text>
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
                    Confirm Selection ({selectedResidents.length})
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
                <Text style={styles.modalTitle}>Announcement History</Text>
                <TouchableOpacity onPress={() => setShowHistory(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {notifications.length > 0 ? (
                <FlatList
                  data={notifications}
                  style={styles.notificationsList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={[styles.notificationItem, item.isUrgent && styles.urgentNotification]}>
                      {item.isUrgent && (
                        <View style={styles.urgentBadge}>
                          <MaterialCommunityIcons name="alert" size={12} color="#fff" />
                          <Text style={styles.urgentBadgeText}>URGENT</Text>
                        </View>
                      )}
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                      <View style={styles.notificationMeta}>
                        <Text style={styles.notificationDate}>
                          {formatTimestamp(item.createdAt)}
                        </Text>
                        <Text style={styles.notificationRecipients}>
                          Sent to {item.sentTo.length} resident{item.sentTo.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.emptyHistory}>
                  <MaterialCommunityIcons name="message-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyHistoryText}>No announcements yet</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
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
  headerContainer: {
    elevation: 4,
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  presidentAvatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: primaryBlue,
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
    color: primaryBlue,
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
    color: primaryBlue,
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
    backgroundColor: primaryBlue,
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
    backgroundColor: primaryBlue,
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

export default BroadcastSystem;