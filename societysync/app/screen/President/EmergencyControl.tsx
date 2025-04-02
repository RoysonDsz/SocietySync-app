import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Colors matching second code
const primaryBlue = '#180DC9';
const primaryCyan = '#06D9E0';

// Filter button colors
const allButtonColor = '#5adbff';
const pendingButtonColor = '#ffaa00';
const approvedButtonColor = '#00c853';
const rejectedButtonColor = '#ff3d00';

const EmergencyTypes = {
  MEDICAL: 'Medical',
  FIRE: 'Fire',
  MAINTENANCE: 'Maintenance',
  SECURITY: 'Security',
  OTHER: 'Other'
};

type EmergencyRequest = {
  id: string;
  visitorName: string;
  type: string;
  purpose: string;
  requestedBy: string;
  timestamp: string;
  status: string;
  rejectReason?: string;
};

const initialRequests: EmergencyRequest[] = [
  {
    id: '1',
    visitorName: 'Dr. Sharma',
    type: EmergencyTypes.MEDICAL,
    purpose: 'Medical emergency in B-205',
    requestedBy: 'Gate 1',
    timestamp: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: '2',
    visitorName: 'Fire Dept',
    type: EmergencyTypes.FIRE,
    purpose: 'Fire safety inspection',
    requestedBy: 'Gate 2',
    timestamp: new Date().toISOString(),
    status: 'approved',
  },
  {
    id: '3',
    visitorName: 'Police Officer',
    type: EmergencyTypes.SECURITY,
    purpose: 'Security alert in parking area',
    requestedBy: 'Gate 3',
    timestamp: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: '4',
    visitorName: 'Ambulance Team',
    type: EmergencyTypes.MEDICAL,
    purpose: 'Emergency response for accident near Block A',
    requestedBy: 'Gate 1',
    timestamp: new Date().toISOString(),
    status: 'approved',
  },
  {
    id: '5',
    visitorName: 'Fire Rescue Unit',
    type: EmergencyTypes.FIRE,
    purpose: 'Fire drill inspection in Block C',
    requestedBy: 'Gate 4',
    timestamp: new Date().toISOString(),
    status: 'rejected',
  },
  {
    id: '6',
    visitorName: 'Safety Officer',
    type: EmergencyTypes.SECURITY,
    purpose: 'Suspicious package report',
    requestedBy: 'Gate 2',
    timestamp: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: '7',
    visitorName: 'Disaster Management Team',
    type: EmergencyTypes.FIRE,
    purpose: 'Earthquake safety audit',
    requestedBy: 'Gate 5',
    timestamp: new Date().toISOString(),
    status: 'approved',
  },
  {
    id: '8',
    visitorName: 'Paramedic Team',
    type: EmergencyTypes.MEDICAL,
    purpose: 'Injury assistance in Block D',
    requestedBy: 'Gate 3',
    timestamp: new Date().toISOString(),
    status: 'pending',
  }
];

type FilterOption = 'all' | 'pending' | 'approved' | 'rejected';

const EmergencyControl = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [filteredRequests, setFilteredRequests] = useState<EmergencyRequest[]>(initialRequests);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  // Add listener for screen dimension changes
  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };
    
    const subscription = Dimensions.addEventListener('change', updateLayout);
    
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === activeFilter));
    }
  }, [activeFilter, requests]);

  const approveRequest = (id: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    setShowModal(false);
    Alert.alert('Success', 'Request approved');
  };

  const rejectRequest = (id: string) => {
    if (!rejectReason) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'rejected', rejectReason } : req));
    setShowModal(false);
    setRejectReason('');
    Alert.alert('Success', 'Request rejected');
  };

  const renderRequestItem = ({ item }: { item: EmergencyRequest }) => (
    <TouchableOpacity style={styles.card} onPress={() => { setSelectedRequest(item); setShowModal(true); }}>
      <View style={styles.cardHeader}>
        <Text style={styles.visitorName}>{item.visitorName}</Text>
        <View style={[styles.badge, getStatusStyle(item.status)]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.purpose}>{item.purpose}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return styles.approvedBadge;
      case 'rejected': return styles.rejectedBadge;
      default: return styles.pendingBadge;
    }
  };

  const getFilterButtonColor = (filter: string) => {
    switch (filter) {
      case 'all': return allButtonColor;
      case 'pending': return pendingButtonColor;
      case 'approved': return approvedButtonColor;
      case 'rejected': return rejectedButtonColor;
      default: return allButtonColor;
    }
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
        minWidth: 60
      };
    } 
    else if (screenWidth < 480) {
      return { 
        paddingVertical: 7,
        paddingHorizontal: 8,
        minWidth: 70
      };
    } 
    else {
      return { 
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 80
      };
    }
  };

  const getFilterText = (filter: string) => {
    if (screenWidth < 320) {
      switch(filter) {
        case 'all': return 'All';
        case 'pending': return 'Pend';
        case 'approved': return 'Appr';
        case 'rejected': return 'Rej';
        default: return filter;
      }
    }
    return filter.charAt(0).toUpperCase() + filter.slice(1);
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
            President Emergency Approval Panel
          </Text>
        </LinearGradient>
        
        {/* Updated Filter container with fixed layout for mobile */}
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {(['all', 'pending', 'approved', 'rejected'] as FilterOption[]).map((filter) => (
              <TouchableOpacity 
                key={filter}
                style={[ 
                  styles.filterButton, 
                  {
                    backgroundColor: getFilterButtonColor(filter),
                    opacity: activeFilter === filter ? 1 : 0.7,
                  },
                  getFilterButtonStyle()
                ]} 
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[ 
                  styles.filterText, 
                  activeFilter === filter && styles.activeFilterText,
                  getFilterTextStyle()
                ]}>
                  {getFilterText(filter)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Request count indicator with black text color */}
        <Text style={[styles.countIndicator, screenWidth < 360 ? { fontSize: 12 } : {}]}>
          Showing {filteredRequests.length} {activeFilter !== 'all' ? activeFilter : ''} request{filteredRequests.length !== 1 ? 's' : ''}
        </Text>
        
        <FlatList 
          data={filteredRequests} 
          renderItem={renderRequestItem} 
          keyExtractor={(item) => item.id} 
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeFilter !== 'all' ? activeFilter : ''} requests found</Text>
            </View>
          }
        />

        {selectedRequest && (
          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, screenWidth < 360 ? { width: '90%' } : { width: '80%' }]}>
                <Text style={styles.modalTitle}>Request Details</Text>
                <Text>Visitor: {selectedRequest.visitorName}</Text>
                <Text>Type: {selectedRequest.type}</Text>
                <Text>Purpose: {selectedRequest.purpose}</Text>
                <Text>Requested By: {selectedRequest.requestedBy}</Text>

                {selectedRequest.rejectReason && (
                  <Text style={styles.rejectReasonText}>Rejection Reason: {selectedRequest.rejectReason}</Text>
                )}

                {selectedRequest.status === 'pending' && (
                  <>
                    <TextInput
                      placeholder="Reason for rejection (if any)"
                      style={styles.input}
                      value={rejectReason}
                      onChangeText={setRejectReason}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.approveButton} onPress={() => approveRequest(selectedRequest.id)}>
                        <Text style={styles.buttonText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => rejectRequest(selectedRequest.id)}>
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff',
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 12, 
    marginBottom: 10, 
    borderRadius: 8, 
    elevation: 2,
    marginHorizontal: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  visitorName: { fontSize: 16, fontWeight: 'bold' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 12 },
  approvedBadge: { backgroundColor: approvedButtonColor },
  rejectedBadge: { backgroundColor: rejectedButtonColor },
  pendingBadge: { backgroundColor: pendingButtonColor },
  type: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  purpose: { fontSize: 14, color: '#666', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timestamp: { fontSize: 12, color: '#999' },
  list: { paddingBottom: 20, paddingTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  approveButton: { backgroundColor: approvedButtonColor, padding: 10, borderRadius: 8 },
  rejectButton: { backgroundColor: rejectedButtonColor, padding: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 10 },
  closeButton: { marginTop: 20, alignSelf: 'center' },
  closeText: { color: '#007bff', fontWeight: 'bold' },
  rejectReasonText: { marginTop: 10, color: 'red', fontStyle: 'italic' },
  // Updated filter container structure for better mobile support
  filterContainer: { 
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  // Added a filter row to maintain horizontal layout
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap', // Prevent wrapping to new line
  },
  filterButton: { 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    marginHorizontal: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic'
  }
});

export default EmergencyControl;