import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { 
  StyleSheet, 
  View, 
  Text, 
  Linking, 
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define the types for the navigation stack
type RootStackParamList = {
  PaymentGateway: { billId: string };
};

// Type for the navigation prop
type MaintenanceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentGateway'>;

const MaintenanceScreen: React.FC = () => {
  const [client, setClient] = useState<any>({});
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use AsyncStorage instead of localStorage
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`https://mrnzp03x-5050.inc1.devtunnels.ms/api/user/ownProfile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClient(response.data.response || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  
  const [bills] = useState([
    { id: "1", type: "Water Bill", amount: 500, status: "Unpaid" },
    { id: "2", type: "Electricity Bill", amount: 0, status: "Paid" },
    { id: "3", type: "Gas Bill", amount: 0, status: "Paid" },
    { id: "4", type: "Internet Bill", amount: 0, status: "Paid" },
    { id: "5", type: "Building Maintenance Bill", amount: 0, status: "Paid" },
    { id: "6", type: "Facility Maintenance Bill", amount: 0, status: "Paid" },
    { id: "7", type: "Equipment Maintenance Bill", amount: 0, status: "Paid" },
  ]);

  const navigation = useNavigation<MaintenanceScreenNavigationProp>();

  const handlePayWithRazorpay = () => {
    // Direct redirection to Razorpay payment gateway
    Linking.openURL("https://rzp.io/i/example-payment-link"); // Replace with actual Razorpay payment link
  };

  // Check if any bill has an amount greater than 0
  const hasUnpaidBills = bills.some((bill) => bill.amount > 0);

  // Calculate total amount of unpaid bills
  const totalAmountDue = bills.reduce((total, bill) => total + bill.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Billing Dashboard</Text>
        </View>

        {/* Client Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Name:</Text>
              <Text style={styles.tableData}>{client?.name || 'Not available'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>House Number:</Text>
              <Text style={styles.tableData}>{client?.houseNumber || 'Not available'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Phone Number:</Text>
              <Text style={styles.tableData}>{client?.phoneNumber || 'Not available'}</Text>
            </View>
          </View>
        </View>

        {/* Bills Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bills</Text>
          <View style={styles.billTableContainer}>
            {/* Table Header */}
            <View style={styles.billTableHeader}>
              <Text style={styles.billTypeHeader}>Bill Type</Text>
              <Text style={styles.billAmountHeader}>Amount</Text>
            </View>
            
            {/* Table Body */}
            <View style={styles.billTableBody}>
              {bills.map((bill, index) => (
                <View 
                  key={bill.id} 
                  style={[
                    styles.billTableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    index === bills.length - 1 ? styles.lastRow : null
                  ]}
                >
                  <Text style={styles.billType}>{bill.type}</Text>
                  <Text style={[
                    styles.billAmount,
                    bill.amount > 0 ? styles.unpaidAmount : styles.paidAmount
                  ]}>
                    ₹{bill.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Total Amount Due and Pay Button */}
          <View style={styles.footer}>
            {hasUnpaidBills ? (
              <>
                <Text style={styles.totalAmountText}>Total Amount Due: ₹{totalAmountDue}</Text>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={handlePayWithRazorpay}
                >
                  <Text style={styles.paymentButtonText}>Pay with Razorpay</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.paidButtonContainer}>
                <Text style={styles.paidText}>All Bills Paid</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated Styles
const Colors = {
  primary: "#3282B8",
  secondary: "#BBE1FA",
  background: "#F5F7FA",
  text: "#1B262C",
  border: "#DFE6ED",
  success: "#2ECC71",
  unpaid: "#E74C3C",
  white: "#FFFFFF",
  lightGray: "#F0F2F5",
  mediumGray: "#E0E4E8",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 12,
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "500",
    width: "40%",
    padding: 12,
    backgroundColor: Colors.lightGray,
    color: Colors.text,
  },
  tableData: {
    fontSize: 16,
    width: "60%",
    padding: 12,
    color: Colors.text,
  },
  billTableContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billTableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
  },
  billTypeHeader: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    width: "60%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.white,
  },
  billAmountHeader: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    width: "40%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.white,
  },
  billTableBody: {
    width: "100%",
  },
  billTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  evenRow: {
    backgroundColor: Colors.lightGray,
  },
  oddRow: {
    backgroundColor: Colors.white,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  billType: {
    fontSize: 16,
    width: "60%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.text,
  },
  billAmount: {
    fontSize: 16,
    width: "40%",
    textAlign: "right",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontWeight: "500",
  },
  unpaidAmount: {
    color: Colors.unpaid,
  },
  paidAmount: {
    color: Colors.success,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
  paymentButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
  },
  paymentButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
  },
  paidButtonContainer: {
    backgroundColor: Colors.success,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  paidText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
});

export default MaintenanceScreen;