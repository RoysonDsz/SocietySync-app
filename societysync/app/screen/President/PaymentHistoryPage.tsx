import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Payment Interface with amount field added
interface Payment {
  id: number;
  name: string;
  date: string;
  amount: number;
  paid: boolean;
}

const BillingHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock data fetching with amount field
  useEffect(() => {
    const fetchPayments = () => {
      const mockData: Payment[] = [
        { id: 1, name: 'John Doe', date: '2025-04-01', amount: 5000, paid: true },
        { id: 2, name: 'Jane Smith', date: '2025-03-15', amount: 7500, paid: false },
        { id: 3, name: 'Sam Wilson', date: '2025-04-05', amount: 3200, paid: true },
        { id: 4, name: 'Michael Brown', date: '2025-03-25', amount: 4800, paid: false },
      ];
      setPayments(mockData);
      applyFilters(mockData, filter, searchQuery);
    };

    fetchPayments();
  }, []);

  // Helper function to get month category of a date
  const getMonthCategory = (dateString: string) => {
    const paymentDate = new Date(dateString);
    const currentDate = new Date();
    
    const paymentMonth = paymentDate.getMonth();
    const paymentYear = paymentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (paymentYear === currentYear && paymentMonth === currentMonth) {
      return 'This Month';
    } else if (
      (paymentYear === currentYear && paymentMonth === currentMonth - 1) || 
      (currentMonth === 0 && paymentYear === currentYear - 1 && paymentMonth === 11)
    ) {
      return 'Last Month';
    } else {
      return 'Older';
    }
  };

  // Combined filter function to apply both search and date filters
  const applyFilters = (paymentsData: Payment[], dateFilter: string, query: string) => {
    let result = paymentsData;
    
    // Apply date filter
    if (dateFilter !== 'All') {
      result = result.filter(payment => getMonthCategory(payment.date) === dateFilter);
    }
    
    // Apply search filter
    if (query !== '') {
      result = result.filter(payment => 
        payment.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredPayments(result);
  };

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
    applyFilters(payments, selectedFilter, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(payments, filter, query);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (selectedPayment) {
      const updatedPayments = payments.map((payment) =>
        payment.id === selectedPayment.id ? selectedPayment : payment
      );
      
      setPayments(updatedPayments);
      applyFilters(updatedPayments, filter, searchQuery);
    }
    setEditModalVisible(false);
    Alert.alert('Success', 'Payment updated successfully');
  };

  const handleChangePaymentStatus = (status: boolean) => {
    if (selectedPayment) {
      setSelectedPayment({ ...selectedPayment, paid: status });
    }
  };

  // Function to format amount in rupees
  const formatRupees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Function to format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  };

  // Group payments by month category
  const groupedPayments = filteredPayments.reduce((acc, payment) => {
    const category = getMonthCategory(payment.date);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);

  // Function to render section header
  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // Function to render the payment list with sections
  const renderPaymentList = () => {
    const sections = Object.keys(groupedPayments);
    
    if (sections.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#B0B0B0" />
          <Text style={styles.emptyText}>No payments found</Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={sections}
        keyExtractor={(item) => item}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader(section)}
            {groupedPayments[section].map((payment) => renderPaymentItem({ item: payment }))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity 
      style={styles.paymentItem} 
      onPress={() => handleEditPayment(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.paid ? ['#DAF8E3', '#FFFFFF'] : ['#FFECEC', '#FFFFFF']}
        style={styles.itemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.itemAmountContainer}>
            <Text style={styles.itemAmount}>{formatRupees(item.amount)}</Text>
            <Text style={[
              styles.statusBadge, 
              item.paid ? styles.paidBadge : styles.unpaidBadge
            ]}>
              {item.paid ? 'Paid' : 'Unpaid'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Billing History</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearch}>
            <MaterialCommunityIcons name="close-circle" size={16} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          onPress={() => handleFilterChange('All')} 
          style={[styles.filterButton, filter === 'All' && styles.activeFilter]}
        >
          <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleFilterChange('This Month')} 
          style={[styles.filterButton, filter === 'This Month' && styles.activeFilter]}
        >
          <Text style={[styles.filterText, filter === 'This Month' && styles.activeFilterText]}>This Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleFilterChange('Last Month')} 
          style={[styles.filterButton, filter === 'Last Month' && styles.activeFilter]}
        >
          <Text style={[styles.filterText, filter === 'Last Month' && styles.activeFilterText]}>Last Month</Text>
        </TouchableOpacity>
      </View>

      {/* Payment List */}
      {renderPaymentList()}

      {/* Edit Payment Modal */}
      {selectedPayment && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setEditModalVisible(false)}
          >
            <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Payment</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.formGroup}>
                  <Text style={styles.modalLabel}>Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedPayment.name}
                    onChangeText={(text) =>
                      setSelectedPayment({ ...selectedPayment, name: text })
                    }
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.modalLabel}>Date</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedPayment.date}
                    onChangeText={(text) =>
                      setSelectedPayment({ ...selectedPayment, date: text })
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.modalLabel}>Amount (₹)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={selectedPayment.amount.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setSelectedPayment({ ...selectedPayment, amount: parseFloat(text) || 0 })
                    }
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.modalLabel}>Payment Status</Text>
                  <View style={styles.paymentStatusContainer}>
                    <TouchableOpacity
                      style={[
                        styles.statusOption,
                        selectedPayment.paid && styles.activeStatusOption,
                        styles.paidOption
                      ]}
                      onPress={() => handleChangePaymentStatus(true)}
                    >
                      <MaterialCommunityIcons
                        name={selectedPayment.paid ? "checkbox-marked-circle" : "circle-outline"}
                        size={20}
                        color={selectedPayment.paid ? "#fff" : "#28A745"}
                      />
                      <Text style={[
                        styles.statusOptionText,
                        selectedPayment.paid && styles.activeStatusOptionText
                      ]}>
                        Paid
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.statusOption,
                        !selectedPayment.paid && styles.activeStatusOption,
                        styles.unpaidOption
                      ]}
                      onPress={() => handleChangePaymentStatus(false)}
                    >
                      <MaterialCommunityIcons
                        name={!selectedPayment.paid ? "checkbox-marked-circle" : "circle-outline"}
                        size={20}
                        color={!selectedPayment.paid ? "#fff" : "#FF3B30"}
                      />
                      <Text style={[
                        styles.statusOptionText,
                        !selectedPayment.paid && styles.activeStatusOptionText
                      ]}>
                        Unpaid
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity 
                  onPress={() => setEditModalVisible(false)} 
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSaveEdit} 
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  header: {
    paddingVertical: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#333',
  },
  clearSearch: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#EAEEF6',
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeFilter: {
    backgroundColor: '#3366FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  sectionHeader: {
    backgroundColor: '#EAEEF6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  paymentItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: '#FFF', // Fallback background
  },
  itemGradient: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3366FF',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 13,
    color: '#666',
  },
  itemAmountContainer: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  paidBadge: {
    backgroundColor: '#28A745',
    color: '#FFFFFF',
  },
  unpaidBadge: {
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F9FC',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  modalInput: {
    height: 45,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
  },
  paidOption: {
    borderColor: '#28A745',
  },
  unpaidOption: {
    borderColor: '#FF3B30',
  },
  activeStatusOption: {
    borderWidth: 0,
  },
  statusOptionText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  activeStatusOptionText: {
    color: '#FFFFFF',
  },
  modalButtonRow: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 2,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BillingHistoryPage;