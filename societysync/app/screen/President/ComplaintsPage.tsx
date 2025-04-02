import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

// Define colors to match the second component
const primaryBlue = '#180DC9';
const primaryCyan = '#06D9E0';
const allButtonColor = '#5adbff';
const pendingButtonColor = '#ffaa00';
const inProgressButtonColor = '#5bc0de';
const resolvedButtonColor = '#5cb85c';

// Define the Complaint interface based on the backend response
interface Complaint {
  id: string;
  name: string;
  role: string;
  complaint: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status?: string;
  comments?: string[];
}

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusChangeAnimation, setStatusChangeAnimation] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const selectedComplaint = selectedComplaintId 
    ? complaints.find(c => c.id === selectedComplaintId) || null 
    : null;

  // Add listener for screen dimension changes
  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };
    
    Dimensions.addEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    // Fetch complaints when component mounts
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('https://mrnzp03x-5050.inc1.devtunnels.ms/api/complaint/get-complaint');
      if (response.data.success) {
        // Initialize status and comments if they don't exist in the response
        const complaintsWithStatuses = response.data.response.map((complaint: Complaint) => ({
          ...complaint,
          status: complaint.status || 'Pending',
          comments: complaint.comments || []
        }));
        setComplaints(complaintsWithStatuses);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints. Please try again later.');
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const filteredComplaints = statusFilter
    ? complaints.filter(complaint => complaint.status === statusFilter)
    : complaints;

  const handleStatusChange = (status: string) => {
    if (selectedComplaint && selectedComplaint.status !== status) {
      const currentDate = getCurrentDate();
      
      const updatedComplaints = complaints.map(c =>
        c.id === selectedComplaint.id 
          ? { ...c, status, updatedAt: currentDate } 
          : c
      );
      
      setComplaints(updatedComplaints);
      
      const systemComment = `[SYSTEM] Status changed to ${status} - ${currentDate}`;
      const updatedWithComment = updatedComplaints.map(c =>
        c.id === selectedComplaint.id
          ? { ...c, comments: [...(c.comments || []), systemComment] }
          : c
      );
      
      setComplaints(updatedWithComment);
      
      setStatusChangeAnimation(selectedComplaint.id);
      setTimeout(() => setStatusChangeAnimation(null), 1500);

      Alert.alert(
        "Status Updated",
        `Complaint #${selectedComplaint.id} status changed to ${status}`,
        [{ text: "OK" }]
      );
    }
  };

  const handleAddComment = () => {
    if (selectedComplaint && newComment.trim() !== '') {
      const currentDate = getCurrentDate();
      const updatedComplaints = complaints.map(c =>
        c.id === selectedComplaint.id
          ? { 
              ...c, 
              comments: [...(c.comments || []), newComment.trim()],
              updatedAt: currentDate
            }
          : c
      );
      setComplaints(updatedComplaints);
      setNewComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return pendingButtonColor;
      case 'In Progress': return inProgressButtonColor;
      case 'Resolved': return resolvedButtonColor;
      default: return '#777';
    }
  };

  const getCountByStatus = (status: string) => {
    return complaints.filter(c => c.status === status).length;
  };

  // Determine filter text size based on screen width
  const getFilterTextStyle = () => {
    if (screenWidth < 360) {
      return { fontSize: 10 };
    } 
    else if (screenWidth < 480) {
      return { fontSize: 12 };
    } 
    else {
      return { fontSize: 14 };
    }
  };

  const getFilterButtonStyle = () => {
    if (screenWidth < 360) {
      return { 
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginHorizontal: 2
      };
    } 
    else if (screenWidth < 480) {
      return { 
        paddingVertical: 7,
        paddingHorizontal: 8,
        marginHorizontal: 3
      };
    } 
    else {
      return { 
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 4
      };
    }
  };

  return (
    <LinearGradient
      colors={[primaryCyan, primaryBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[primaryCyan, primaryBlue]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.headerTitle, screenWidth < 360 ? { fontSize: 18 } : {}]}>
            Apartment Complaints Management
          </Text>
        </LinearGradient>
        
        {/* Status Filter Buttons with Count */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              {
                backgroundColor: allButtonColor,
                opacity: statusFilter === null ? 1 : 0.7,
              },
              getFilterButtonStyle()
            ]}
            onPress={() => setStatusFilter(null)}
          >
            <Text style={[
              styles.filterText, 
              statusFilter === null && styles.activeFilterText,
              getFilterTextStyle()
            ]}>
              All ({complaints.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              {
                backgroundColor: pendingButtonColor,
                opacity: statusFilter === 'Pending' ? 1 : 0.7,
              },
              getFilterButtonStyle()
            ]}
            onPress={() => setStatusFilter('Pending')}
          >
            <Text style={[
              styles.filterText, 
              statusFilter === 'Pending' && styles.activeFilterText,
              getFilterTextStyle()
            ]}>
              Pending ({getCountByStatus('Pending')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              {
                backgroundColor: inProgressButtonColor,
                opacity: statusFilter === 'In Progress' ? 1 : 0.7,
              },
              getFilterButtonStyle()
            ]}
            onPress={() => setStatusFilter('In Progress')}
          >
            <Text style={[
              styles.filterText, 
              statusFilter === 'In Progress' && styles.activeFilterText,
              getFilterTextStyle()
            ]}>
              In Progress ({getCountByStatus('In Progress')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              {
                backgroundColor: resolvedButtonColor,
                opacity: statusFilter === 'Resolved' ? 1 : 0.7,
              },
              getFilterButtonStyle()
            ]}
            onPress={() => setStatusFilter('Resolved')}
          >
            <Text style={[
              styles.filterText, 
              statusFilter === 'Resolved' && styles.activeFilterText,
              getFilterTextStyle()
            ]}>
              Resolved ({getCountByStatus('Resolved')})
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.countIndicator}>
          Showing {filteredComplaints.length} {statusFilter ? statusFilter : 'total'} complaint{filteredComplaints.length !== 1 ? 's' : ''}
        </Text>

        <FlatList
          data={filteredComplaints}
          keyExtractor={item => item.id}
          extraData={complaints}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card, 
                statusChangeAnimation === item.id && styles.highlightedCard
              ]}
              onPress={() => setSelectedComplaintId(item.id)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name} ({item.role})</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'Pending') }]}>
                  <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
                </View>
              </View>
              <Text style={styles.complaint}>Complaint: {item.complaint}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.timestamp}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.timestamp}>Updated: {new Date(item.updatedAt).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {statusFilter ? statusFilter : ''} complaints found</Text>
            </View>
          }
        />

        <Modal visible={selectedComplaint !== null} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, screenWidth < 360 ? { width: '90%' } : { width: '85%' }]}>
              {selectedComplaint && (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <Text style={styles.modalTitle}>Complaint #{selectedComplaint.id}</Text>
                  
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Resident:</Text>
                      <Text style={styles.detailValue}>{selectedComplaint.name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Role:</Text>
                      <Text style={styles.detailValue}>{selectedComplaint.role}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Complaint:</Text>
                      <Text style={styles.detailValue}>{selectedComplaint.complaint}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedComplaint.status || 'Pending') }]}>
                        <Text style={styles.statusText}>{selectedComplaint.status || 'Pending'}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Created:</Text>
                      <Text style={styles.detailValue}>{new Date(selectedComplaint.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Updated:</Text>
                      <Text style={styles.detailValue}>{new Date(selectedComplaint.updatedAt).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  <Text style={styles.subTitle}>Change Status:</Text>
                  <View style={styles.statusButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.statusButton, 
                        { backgroundColor: pendingButtonColor },
                        selectedComplaint.status === 'Pending' && styles.selectedStatusButton
                      ]}
                      onPress={() => handleStatusChange('Pending')}>
                      <Text style={styles.buttonText}>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.statusButton, 
                        { backgroundColor: inProgressButtonColor },
                        selectedComplaint.status === 'In Progress' && styles.selectedStatusButton
                      ]}
                      onPress={() => handleStatusChange('In Progress')}>
                      <Text style={styles.buttonText}>In Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.statusButton, 
                        { backgroundColor: resolvedButtonColor },
                        selectedComplaint.status === 'Resolved' && styles.selectedStatusButton
                      ]}
                      onPress={() => handleStatusChange('Resolved')}>
                      <Text style={styles.buttonText}>Resolved</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subTitle}>Activity Log:</Text>
                  <View style={styles.commentsContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                      {selectedComplaint.comments && selectedComplaint.comments.length > 0 ? (
                        selectedComplaint.comments.map((comment, index) => (
                          <View 
                            key={index} 
                            style={[
                              styles.commentItem,
                              comment.includes('[SYSTEM] Status changed to') && styles.statusChangeComment
                            ]}
                          >
                            <Text>{comment}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noComments}>No activity yet</Text>
                      )}
                    </ScrollView>
                  </View>

                  <Text style={styles.subTitle}>Add Comment:</Text>
                  <TextInput
                    placeholder="Type your comment here..."
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.input}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.button, { opacity: newComment.trim() ? 1 : 0.5 }]} 
                    onPress={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Text style={styles.buttonText}>Add Comment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedComplaintId(null)}>
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)'
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff',
    textAlign: 'center'
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  filterButton: { 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  filterText: { 
    textAlign: 'center', 
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  activeFilterText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  countIndicator: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontStyle: 'italic',
    paddingHorizontal: 16,
  },
  list: { 
    paddingBottom: 20,
    paddingTop: 10
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 12, 
    marginBottom: 10, 
    borderRadius: 8, 
    elevation: 2,
    marginHorizontal: 16,
  },
  highlightedCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 4 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  complaint: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8 
  },
  timestamp: { 
    fontSize: 12, 
    color: '#999' 
  },
  statusBadge: {
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 8,
    maxHeight: '90%'
  },
  scrollContent: {
    paddingBottom: 10,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  subTitle: { 
    fontWeight: 'bold', 
    marginTop: 15, 
    marginBottom: 8,
    fontSize: 16,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedStatusButton: {
    borderWidth: 2,
    borderColor: '#000',
    transform: [{ scale: 1.05 }],
  },
  commentsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    maxHeight: 150,
  },
  commentItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusChangeComment: {
    backgroundColor: '#e8f4f8',
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  noComments: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 10,
    color: '#777',
  },
  input: { 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 8, 
    marginVertical: 10,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff'
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 10, 
    borderRadius: 8, 
    marginTop: 10 
  },
  buttonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  closeButton: { 
    marginTop: 20, 
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeText: { 
    color: '#007bff', 
    fontWeight: 'bold' 
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    margin: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic'
  }
});

export default ComplaintsPage;