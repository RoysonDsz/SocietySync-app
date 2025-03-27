import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
  Modal
} from 'react-native';

// Get screen dimensions for responsive layout
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Define TypeScript interfaces
interface Visitor {
  id: number;
  name: string;
  phone: string;
  purpose: string;
  flatNo: string;
  checkIn: string;
  checkOut: string | null;
  status: 'checked-in' | 'checked-out';
}

const PresidentVisitorLog: React.FC = () => {
  // Sample initial visitor data - same as watchman side
  const [visitors, setVisitors] = useState<Visitor[]>([
    { 
      id: 1, 
      name: "John Smith", 
      phone: "555-123-4567", 
      purpose: "Meeting with resident", 
      flatNo: "A-101", 
      checkIn: "2025-03-19T09:30:00", 
      checkOut: "2025-03-19T11:45:00",
      status: "checked-out"
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      phone: "555-987-6543", 
      purpose: "Delivery", 
      flatNo: "B-205", 
      checkIn: "2025-03-19T10:15:00", 
      checkOut: null,
      status: "checked-in"
    },
    { 
      id: 3, 
      name: "Mike Wilson", 
      phone: "555-456-7890", 
      purpose: "Maintenance", 
      flatNo: "C-302", 
      checkIn: "2025-03-19T08:45:00", 
      checkOut: null,
      status: "checked-in"
    }
  ]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for selected visitor details
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  
  // State for filter type
  const [filterType, setFilterType] = useState<'all' | 'checked-in' | 'checked-out'>('all');

  // Date filter states
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [startDate, setStartDate] = useState(""); // Format: YYYY-MM-DD
  const [endDate, setEndDate] = useState(""); // Format: YYYY-MM-DD
  
  // Function to view visitor details
  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
  };

  // Function to close visitor details
  const handleCloseDetails = () => {
    setSelectedVisitor(null);
  };

  // Format date for display
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  // Apply all filters
  const filteredVisitors = visitors.filter(visitor => {
    // Apply search filter
    const matchesSearch = 
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      visitor.phone.includes(searchTerm) ||
      visitor.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      filterType === 'all' || 
      visitor.status === filterType;
    
    // Apply date filter if active
    let matchesDate = true;
    if (isDateFilterActive && startDate && endDate) {
      const visitorDate = new Date(visitor.checkIn).toISOString().split('T')[0];
      const filterStartDate = startDate;
      const filterEndDate = endDate;
      
      matchesDate = visitorDate >= filterStartDate && visitorDate <= filterEndDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Get statistics
  const totalVisitors = visitors.length;
  const checkedInVisitors = visitors.filter(v => v.status === 'checked-in').length;
  const checkedOutVisitors = visitors.filter(v => v.status === 'checked-out').length;

  // Table header component
  const TableHeader: React.FC = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 2.5 }]}>Visitor</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Flat</Text>
      <Text style={[styles.headerCell, { flex: 1.5 }]}>Time</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
    </View>
  );

  // Table row component
  const VisitorRow: React.FC<{ visitor: Visitor }> = ({ visitor }) => (
    <TouchableOpacity 
      style={styles.tableRow}
      onPress={() => handleViewDetails(visitor)}
    >
      <View style={[styles.tableCell, { flex: 2.5 }]}>
        <Text style={styles.visitorName} numberOfLines={1}>{visitor.name}</Text>
        <Text style={styles.visitorPurpose} numberOfLines={1}>{visitor.purpose}</Text>
      </View>
      <Text style={[styles.tableCell, { flex: 1 }]} numberOfLines={1}>{visitor.flatNo}</Text>
      <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>
        {new Date(visitor.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
      <View style={[styles.tableCell, { flex: 1 }]}>
        <View style={[
          styles.statusBadge, 
          visitor.status === "checked-in" ? styles.checkedInBadge : styles.checkedOutBadge
        ]}>
          <Text style={styles.statusText}>
            {visitor.status === "checked-in" ? "In" : "Out"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Date filter component
  const DateFilterModal: React.FC<{
    visible: boolean,
    onClose: () => void,
    onApply: (start: string, end: string) => void
  }> = ({ visible, onClose, onApply }) => {
    const [tempStartDate, setTempStartDate] = useState(startDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);
    
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Date</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput 
                  style={styles.input}
                  value={tempStartDate}
                  onChangeText={setTempStartDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>End Date</Text>
                <TextInput 
                  style={styles.input}
                  value={tempEndDate}
                  onChangeText={setTempEndDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.applyButton]}
                onPress={() => {
                  onApply(tempStartDate, tempEndDate);
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Stats component
  const StatsBar: React.FC = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalVisitors}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{checkedInVisitors}</Text>
        <Text style={styles.statLabel}>Checked In</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{checkedOutVisitors}</Text>
        <Text style={styles.statLabel}>Checked Out</Text>
      </View>
    </View>
  );

  const [showDateFilter, setShowDateFilter] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Society Visitor Log</Text>
      
      {/* Stats Bar */}
      <StatsBar />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search..."
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filterType === 'all' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'all' && styles.activeFilterText
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filterType === 'checked-in' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('checked-in')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'checked-in' && styles.activeFilterText
            ]}>In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filterType === 'checked-out' && styles.activeFilterButton
            ]}
            onPress={() => setFilterType('checked-out')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'checked-out' && styles.activeFilterText
            ]}>Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              isDateFilterActive && styles.activeFilterButton
            ]}
            onPress={() => setShowDateFilter(true)}
          >
            <Text style={[
              styles.filterButtonText,
              isDateFilterActive && styles.activeFilterText
            ]}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visitor List */}
      <View style={styles.visitorsSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Visitors ({filteredVisitors.length})</Text>
          {isDateFilterActive && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => {
                setIsDateFilterActive(false);
                setStartDate("");
                setEndDate("");
              }}
            >
              <Text style={styles.clearFilterText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.tableContainer}>
          <TableHeader />
          
          {filteredVisitors.length > 0 ? (
            <FlatList
              data={filteredVisitors}
              renderItem={({ item }) => <VisitorRow visitor={item} />}
              keyExtractor={item => item.id.toString()}
              style={styles.visitorList}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No visitors found matching your filters.</Text>
            </View>
          )}
        </View>
      </View>

      {/* Date Filter Modal */}
      <DateFilterModal 
        visible={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          setIsDateFilterActive(true);
        }}
      />

      {/* Visitor Details Modal */}
      <Modal
        visible={selectedVisitor !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Visitor Details</Text>
              <TouchableOpacity onPress={handleCloseDetails}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            {selectedVisitor && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedVisitor.name}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{selectedVisitor.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Flat Number:</Text>
                  <Text style={styles.detailValue}>{selectedVisitor.flatNo}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Purpose:</Text>
                  <Text style={styles.detailValue}>{selectedVisitor.purpose}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Check In:</Text>
                  <Text style={styles.detailValue}>{formatDateTime(selectedVisitor.checkIn)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Check Out:</Text>
                  <Text style={styles.detailValue}>{formatDateTime(selectedVisitor.checkOut)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedVisitor.status === "checked-in" ? styles.checkedInBadge : styles.checkedOutBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {selectedVisitor.status === "checked-in" ? "Checked In" : "Checked Out"}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.button, styles.closeModalButton]}
                onPress={handleCloseDetails}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'column',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    paddingLeft: 30,
    fontSize: 14,
    height: 36,
  },
  searchIcon: {
    position: 'absolute',
    left: 8,
    top: 8,
    fontSize: 14,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#4a90e2',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  visitorsSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  clearFilterButton: {
    padding: 4,
  },
  clearFilterText: {
    color: '#4a90e2',
    fontSize: 12,
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 6,
    minHeight: 48,
    alignItems: 'center',
  },
  tableCell: {
    padding: 3,
    fontSize: 12,
  },
  visitorName: {
    fontSize: 13,
    fontWeight: '500',
  },
  visitorPurpose: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  visitorList: {
    height: '100%',
  },
  statusBadge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  checkedInBadge: {
    backgroundColor: '#e6f7e6',
  },
  checkedOutBadge: {
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  noResults: {
    padding: 15,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  modalBody: {
    padding: 12,
    maxHeight: 300,
  },
  detailItem: {
    marginBottom: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 90,
    color: '#555',
    fontSize: 13,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
  },
  modalFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  closeModalButton: {
    backgroundColor: '#6c757d',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  applyButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
    color: '#333',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    height: 40,
  },
});

export default PresidentVisitorLog;