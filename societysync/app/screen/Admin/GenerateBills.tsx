import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Send, PlusCircle, Trash2 } from 'lucide-react-native';

type BillItem = {
  id: string;
  description: string;
  amount: string;
};

type Resident = {
  id: string;
  name: string;
  flat: string;
  block: string;
  phone?: string;
  email?: string;
};

type Bill = {
  id: string;
  residentId: string;
  month: string;
  year: string;
  dueDate: string;
  items: BillItem[];
  status: 'pending' | 'paid' | 'overdue';
  totalAmount: number;
};

const GenerateBills = ({ route, navigation }: any) => {
  const { resident }: { resident: Resident } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  
  const currentDate = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Set default due date to 15 days from now
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 15);
  
  const [month, setMonth] = useState(monthNames[currentDate.getMonth()]);
  const [year, setYear] = useState(currentDate.getFullYear().toString());
  const [dueDate, setDueDate] = useState(
    `${dueDateObj.getDate().toString().padStart(2, '0')}/${(dueDateObj.getMonth() + 1).toString().padStart(2, '0')}/${dueDateObj.getFullYear()}`
  );
  
  const [billItems, setBillItems] = useState<BillItem[]>([
    { id: '1', description: 'Building Maintenance', amount: '2000' },
    { id: '2', description: 'Water Charges', amount: '500' },
    { id: '3', description: 'Electricity', amount: '1200' },
    { id: '4', description: 'Gas Bill', amount: '800' },
    { id: '5', description: 'Internet', amount: '600' },
    { id: '6', description: 'Facility Maintenance', amount: '1000' },
    { id: '7', description: 'Equipment Maintenance', amount: '750' },
    { id: '8', description: 'Security Charges', amount: '800' }
  ]);
  
  const [existingBills, setExistingBills] = useState<Bill[]>([
    {
      id: '1',
      residentId: resident.id,
      month: 'February',
      year: '2025',
      dueDate: '15/02/2025',
      items: [
        { id: '1', description: 'Building Maintenance', amount: '2000' },
        { id: '2', description: 'Water Charges', amount: '500' },
        { id: '3', description: 'Electricity', amount: '1150' },
        { id: '4', description: 'Gas Bill', amount: '750' },
      ],
      status: 'paid',
      totalAmount: 4400
    }
  ]);
  
  const handleAddItem = () => {
    const newId = (billItems.length > 0 
      ? Math.max(...billItems.map(item => parseInt(item.id))) + 1 
      : 1).toString();
    
    setBillItems([...billItems, { id: newId, description: '', amount: '' }]);
  };
  
  const handleRemoveItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };
  
  const updateBillItem = (id: string, field: 'description' | 'amount', value: string) => {
    setBillItems(billItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const calculateTotal = (): number => {
    return billItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };
  
  const validateBill = (): boolean => {
    // Check for empty descriptions
    const emptyDescriptions = billItems.some(item => !item.description.trim());
    if (emptyDescriptions) {
      Alert.alert('Error', 'All bill items must have descriptions');
      return false;
    }
    
    // Check for valid amounts
    const invalidAmounts = billItems.some(item => {
      const amount = parseFloat(item.amount);
      return isNaN(amount) || amount <= 0;
    });
    
    if (invalidAmounts) {
      Alert.alert('Error', 'All amounts must be valid numbers greater than zero');
      return false;
    }
    
    // Check for due date format (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert('Error', 'Due date must be in DD/MM/YYYY format');
      return false;
    }
    
    return true;
  };
  
  const handleGenerateBill = () => {
    if (!validateBill()) {
      return;
    }
    
    // Check if a bill already exists for this month/year
    const billExists = existingBills.some(bill => 
      bill.month === month && bill.year === year
    );
    
    if (billExists) {
      Alert.alert(
        'Bill Exists',
        `A bill for ${month} ${year} already exists. Do you want to replace it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Replace', 
            style: 'destructive',
            onPress: generateNewBill
          }
        ]
      );
    } else {
      generateNewBill();
    }
  };
  
  // Function to save bill to backend
  const saveBillToBackend = async (bill: Bill): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Replace with your actual API endpoint
      const response = await fetch('https://mrnzp03x-5050.inc1.devtunnels.ms/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bill),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save bill');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert(
        'Error',
        'Failed to save the bill. Please try again later.',
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateNewBill = async () => {
    const totalAmount = calculateTotal();
    
    const newBill: Bill = {
      id: (existingBills.length > 0 
        ? Math.max(...existingBills.map(bill => parseInt(bill.id))) + 1 
        : 1).toString(),
      residentId: resident.id,
      month,
      year,
      dueDate,
      items: [...billItems],
      status: 'pending',
      totalAmount
    };
    
    // Save bill to backend
    const success = await saveBillToBackend(newBill);
    
    if (success) {
      // Remove existing bill for the same month/year if exists
      const updatedBills = existingBills.filter(bill => 
        !(bill.month === month && bill.year === year)
      );
      
      setExistingBills([...updatedBills, newBill]);
      
      Alert.alert(
        'Success',
        `Bill for ${resident.name} has been generated successfully for ${month} ${year}.`,
        [{ 
          text: 'OK',
          onPress: () => {
            // Optionally navigate to a bills list or bill detail screen
            // navigation.navigate('BillsList', { residentId: resident.id });
          } 
        }]
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Generate Bill</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.residentInfo}>
          <Text style={styles.residentName}>{resident.name}</Text>
          <Text style={styles.flatInfo}>Flat: {resident.flat} | Block: {resident.block}</Text>
          {resident.phone && <Text style={styles.contactInfo}>📞 {resident.phone}</Text>}
        </View>
        
        <View style={styles.billPeriodSection}>
          <Text style={styles.sectionTitle}>Bill Period</Text>
          
          <View style={styles.rowContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Month</Text>
              <View style={styles.picker}>
                <TextInput 
                  style={styles.input}
                  value={month}
                  onChangeText={setMonth}
                  placeholder="Month"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year</Text>
              <TextInput 
                style={styles.input}
                value={year}
                onChangeText={setYear}
                keyboardType="number-pad"
                placeholder="Year"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date (DD/MM/YYYY)</Text>
            <TextInput 
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="DD/MM/YYYY"
            />
          </View>
        </View>
        
        <View style={styles.billItemsSection}>
          <Text style={styles.sectionTitle}>Bill Items</Text>
          
          {billItems.map((item, index) => (
            <View key={item.id} style={styles.billItem}>
              <View style={styles.billItemFields}>
                <TextInput 
                  style={styles.descriptionInput}
                  value={item.description}
                  onChangeText={(value) => updateBillItem(item.id, 'description', value)}
                  placeholder="Description"
                />
                
                <TextInput 
                  style={styles.amountInput}
                  value={item.amount}
                  onChangeText={(value) => updateBillItem(item.id, 'amount', value)}
                  keyboardType="numeric"
                  placeholder="Amount"
                />
              </View>
              
              {billItems.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}>
                  <Trash2 size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={handleAddItem}>
            <PlusCircle size={18} color="#4361ee" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
          
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.previousBillsSection}>
          <Text style={styles.sectionTitle}>Previous Bills</Text>
          
          {existingBills.length > 0 ? (
            existingBills.map(bill => (
              <View key={bill.id} style={styles.previousBill}>
                <View>
                  <Text style={styles.billPeriod}>{bill.month} {bill.year}</Text>
                  <Text style={styles.billDue}>Due: {bill.dueDate}</Text>
                  <Text style={styles.billItems}>{bill.items.length} items</Text>
                </View>
                
                <View style={styles.billStatus}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: 
                      bill.status === 'paid' ? '#4ade80' : 
                      bill.status === 'overdue' ? '#ef4444' : '#f59e0b' 
                    }
                  ]}>
                    <Text style={styles.statusText}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.billAmount}>₹{bill.totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noBills}>No previous bills found</Text>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.generateButton, isLoading && styles.disabledButton]}
        onPress={handleGenerateBill}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Send size={20} color="white" />
            <Text style={styles.generateButtonText}>Generate Bill</Text>
          </>
        )}
      </TouchableOpacity>
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
  billPeriodSection: {
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputGroup: {
    marginBottom: 12,
    flex: 1,
    marginRight: 8
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666'
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  picker: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  billItemsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  billItemFields: {
    flex: 1,
    flexDirection: 'row'
  },
  descriptionInput: {
    flex: 2,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  amountInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  removeButton: {
    backgroundColor: '#ef476f',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4361ee',
    marginBottom: 16
  },
  addItemText: {
    color: '#4361ee',
    fontWeight: 'bold',
    marginLeft: 6
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4361ee'
  },
  previousBillsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  previousBill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  billPeriod: {
    fontWeight: 'bold',
    color: '#333'
  },
  billDue: {
    fontSize: 12,
    color: '#666'
  },
  billItems: {
    fontSize: 12,
    color: '#666'
  },
  billStatus: {
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
  billAmount: {
    fontWeight: 'bold',
    color: '#333'
  },
  noBills: {
    color: '#666',
    textAlign: 'center',
    marginTop: 10
  },
  generateButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4361ee',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8
  },
  disabledButton: {
    backgroundColor: '#a0aec0'
  }
});

export default GenerateBills;