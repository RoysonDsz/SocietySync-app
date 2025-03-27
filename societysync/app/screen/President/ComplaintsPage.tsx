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
} from 'react-native';

interface Complaint {
  id: number;
  residentName: string;
  apartmentNumber: string;
  complaintCategory: string;
  priority: string;
  comments: string[];
  status: string;
  dateCreated: string;
  lastUpdated: string;
}

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      residentName: 'Alice',
      apartmentNumber: 'A-101',
      complaintCategory: 'Plumbing',
      priority: 'High',
      comments: ['Leaking pipe under sink.'],
      status: 'Pending',
      dateCreated: '2025-03-20',
      lastUpdated: '2025-03-20',
    },
    {
      id: 2,
      residentName: 'Bob',
      apartmentNumber: 'B-202',
      complaintCategory: 'Electricity',
      priority: 'Medium',
      comments: ['Frequent power trips.'],
      status: 'In Progress',
      dateCreated: '2025-03-19',
      lastUpdated: '2025-03-21',
    },
    {
      id: 3,
      residentName: 'Charlie',
      apartmentNumber: 'C-303',
      complaintCategory: 'Security',
      priority: 'Low',
      comments: ['Main gate lock not working properly.'],
      status: 'Resolved',
      dateCreated: '2025-03-18',
      lastUpdated: '2025-03-22',
    },
    {
      id: 4,
      residentName: 'Diana',
      apartmentNumber: 'D-404',
      complaintCategory: 'Cleaning',
      priority: 'High',
      comments: ['Garbage not collected for 3 days.'],
      status: 'Pending',
      dateCreated: '2025-03-21',
      lastUpdated: '2025-03-21',
    },
    {
      id: 5,
      residentName: 'Ethan',
      apartmentNumber: 'E-505',
      complaintCategory: 'Water Supply',
      priority: 'Medium',
      comments: ['Low water pressure in bathroom.'],
      status: 'In Progress',
      dateCreated: '2025-03-17',
      lastUpdated: '2025-03-20',
    }
  ]);

  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusChangeAnimation, setStatusChangeAnimation] = useState<number | null>(null);

  const selectedComplaint = selectedComplaintId 
    ? complaints.find(c => c.id === selectedComplaintId) || null 
    : null;

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
          ? { ...c, status, lastUpdated: currentDate } 
          : c
      );
      
      setComplaints(updatedComplaints);
      
      const systemComment = `[SYSTEM] Status changed to ${status} - ${currentDate}`;
      const updatedWithComment = updatedComplaints.map(c =>
        c.id === selectedComplaint.id
          ? { ...c, comments: [...c.comments, systemComment] }
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
              comments: [...c.comments, newComment.trim()],
              lastUpdated: currentDate
            }
          : c
      );
      setComplaints(updatedComplaints);
      setNewComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f0ad4e';
      case 'In Progress': return '#5bc0de';
      case 'Resolved': return '#5cb85c';
      default: return '#777';
    }
  };

  const getCountByStatus = (status: string) => {
    return complaints.filter(c => c.status === status).length;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Apartment Complaints Management</Text>
      
      {/* Status Filter Buttons with Count */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, !statusFilter && styles.activeFilter]}
          onPress={() => setStatusFilter(null)}
        >
          <Text style={[styles.filterText, !statusFilter && styles.activeFilterText]}>
            All ({complaints.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'Pending' && styles.activeFilter]}
          onPress={() => setStatusFilter('Pending')}
        >
          <Text style={[styles.filterText, statusFilter === 'Pending' && styles.activeFilterText]}>
            Pending ({getCountByStatus('Pending')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'In Progress' && styles.activeFilter]}
          onPress={() => setStatusFilter('In Progress')}
        >
          <Text style={[styles.filterText, statusFilter === 'In Progress' && styles.activeFilterText]}>
            In Progress ({getCountByStatus('In Progress')})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'Resolved' && styles.activeFilter]}
          onPress={() => setStatusFilter('Resolved')}
        >
          <Text style={[styles.filterText, statusFilter === 'Resolved' && styles.activeFilterText]}>
            Resolved ({getCountByStatus('Resolved')})
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.listHeader}>
        {statusFilter ? `${statusFilter} Complaints (${filteredComplaints.length})` : `All Complaints (${filteredComplaints.length})`}
      </Text>

      <FlatList
        data={filteredComplaints}
        keyExtractor={item => item.id.toString()}
        extraData={complaints}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card, 
              statusChangeAnimation === item.id && styles.highlightedCard,
              { borderLeftColor: getStatusColor(item.status) }
            ]}
            onPress={() => setSelectedComplaintId(item.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.residentName} ({item.apartmentNumber})</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text>Category: {item.complaintCategory}</Text>
            <Text>Priority: {item.priority}</Text>
            <Text>Created: {item.dateCreated}</Text>
            <Text>Last Updated: {item.lastUpdated}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        }
      />

      <Modal visible={selectedComplaint !== null} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          {selectedComplaint && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complaint #{selectedComplaint.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedComplaint.status) }]}>
                  <Text style={styles.statusText}>{selectedComplaint.status}</Text>
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Resident:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.residentName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Apartment:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.apartmentNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.complaintCategory}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Priority:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.priority}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.dateCreated}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Updated:</Text>
                  <Text style={styles.detailValue}>{selectedComplaint.lastUpdated}</Text>
                </View>
              </View>

              <Text style={styles.subTitle}>Change Status:</Text>
              <View style={styles.statusButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton, 
                    { backgroundColor: '#f0ad4e' },
                    selectedComplaint.status === 'Pending' && styles.selectedStatusButton
                  ]}
                  onPress={() => handleStatusChange('Pending')}>
                  <Text style={styles.buttonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton, 
                    { backgroundColor: '#5bc0de' },
                    selectedComplaint.status === 'In Progress' && styles.selectedStatusButton
                  ]}
                  onPress={() => handleStatusChange('In Progress')}>
                  <Text style={styles.buttonText}>In Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton, 
                    { backgroundColor: '#5cb85c' },
                    selectedComplaint.status === 'Resolved' && styles.selectedStatusButton
                  ]}
                  onPress={() => handleStatusChange('Resolved')}>
                  <Text style={styles.buttonText}>Resolved</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subTitle}>Activity Log:</Text>
              <View style={styles.commentsContainer}>
                {selectedComplaint.comments.length > 0 ? (
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
                style={[styles.button, { backgroundColor: 'red', marginTop: 20 }]}
                onPress={() => setSelectedComplaintId(null)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#f4f4f4' 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    padding: 5,
    flexWrap: 'wrap', // Ensure buttons wrap on small screens
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontWeight: '500',
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  listHeader: {
    fontWeight: 'bold',
    marginVertical: 8,
    fontSize: 16,
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginVertical: 8, 
    borderRadius: 10, 
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff'
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
    marginBottom: 10,
  },
  cardTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent: { 
    padding: 20 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
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
    marginTop: 20, 
    marginBottom: 10,
    fontSize: 18,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 12,
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
    maxHeight: 300,
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
    padding: 10, 
    marginVertical: 10,
    height: 80,
    textAlignVertical: 'top'
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 5 
  },
  buttonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  }
});

export default ComplaintsPage;
