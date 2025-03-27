import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ChevronLeft, Download, Calendar, Filter } from 'lucide-react-native';

type Payment = {
  id: string;
  billId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: 'cash' | 'online' | 'bank transfer';
  month: string;
  year: string;
};

type Resident = {
  id: string;
  name: string;
  flat: string;
  block: string;
  phone?: string;
  email?: string;
};

const PaymentReports = ({ route, navigation }: any) => {
  const { resident }: { resident: Resident } = route.params;

  // Mock payment data - more comprehensive than before
  //const [payments, setPayments]=useState([]);
  const payments: Payment[] = [
    { 
      id: '1', 
      billId: '101',
      amount: 5650, 
      status: 'completed', 
      date: '15/02/2025',
      method: 'online',
      month: 'February',
      year: '2025'
    },
    { 
      id: '2', 
      billId: '102',
      amount: 4400, 
      status: 'completed', 
      date: '15/01/2025',
      method: 'bank transfer',
      month: 'January',
      year: '2025'
    },
    { 
      id: '3', 
      billId: '103',
      amount: 6200, 
      status: 'pending', 
      date: '20/03/2025',
      method: 'cash',
      month: 'March',
      year: '2025'
    },
  ];
   
  const getTotalPaid = () => {
    {
      /*
      
      */
    }
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(payment => payment.status === 'pending')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const renderPaymentStatusBadge = (status: string) => {
    let backgroundColor = '#f59e0b'; // Default color

    if (status === 'completed') {
      backgroundColor = '#4ade80';
    } else if (status === 'failed') {
      backgroundColor = '#ef4444';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={styles.statusText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Reports</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.residentInfo}>
          <Text style={styles.residentName}>{resident.name}</Text>
          <Text style={styles.flatInfo}>Flat: {resident.flat} | Block: {resident.block}</Text>
          {resident.phone && <Text style={styles.contactInfo}>📞 {resident.phone}</Text>}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryAmount}>₹{getTotalPaid().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryAmount, { color: '#ef4444' }]}>₹{getPendingAmount().toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Calendar size={16} color="#4361ee" />
            <Text style={styles.filterText}>Date Range</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#4361ee" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exportButton}>
            <Download size={16} color="#fff" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentsSection}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          
          {payments.length > 0 ? (
            payments.map(payment => (
              <View key={payment.id} style={styles.paymentCard}>
                <View>
                  <Text style={styles.paymentPeriod}>{payment.month} {payment.year}</Text>
                  <Text style={styles.paymentDate}>Date: {payment.date}</Text>
                  <Text style={styles.paymentMethod}>Method: {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</Text>
                </View>
                
                <View style={styles.paymentInfo}>
                  {renderPaymentStatusBadge(payment.status)}
                  <Text style={styles.paymentAmount}>₹{payment.amount.toFixed(2)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noPayments}>No payment records found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  backButton: {
    marginRight: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  residentInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
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
  contactInfo: {
    fontSize: 14,
    color: '#3a86ff',
    marginTop: 2
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 0.48
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4361ee'
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  filterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4361ee',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterText: {
    color: '#4361ee',
    fontWeight: '500',
    marginLeft: 6
  },
  exportButton: {
    backgroundColor: '#4361ee',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  exportText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6
  },
  paymentsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  paymentPeriod: {
    fontWeight: 'bold',
    color: '#333'
  },
  paymentDate: {
    fontSize: 12,
    color: '#666'
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666'
  },
  paymentInfo: {
    alignItems: 'flex-end'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  paymentAmount: {
    fontWeight: 'bold',
    color: '#333'
  },
  noPayments: {
    color: '#666',
    textAlign: 'center',
    marginTop: 10
  }
});

export default PaymentReports;