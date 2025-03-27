import React, { useState } from "react";
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

// Define the types for the navigation stack
type RootStackParamList = {
  PaymentGateway: { billId: string };
};

// Type for the navigation prop
type MaintenanceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentGateway'>;

const MaintenanceScreen: React.FC = () => {
  const [client] = useState({
    name: "John Doe",
    houseNumber: "101",
    phoneNumber: "1234567890", // Static phone number
  });

  const [bills] = useState([
    { id: "1", type: "Water Bill", amount: 0, status: "Unpaid" },
    { id: "2", type: "Electricity Bill", amount: 0, status: "Paid" },
    { id: "3", type: "Gas Bill", amount: 0, status: "Paid" },
    { id: "4", type: "Internet Bill", amount: 0, status: "Paid" },
    { id: "5", type: "Building Maintenance Bill", amount: 0, status: "Paid" },
    { id: "6", type: "Facility Maintenance Bill", amount: 0, status: "Paid" },
    { id: "7", type: "Equipment Maintenance Bill", amount: 0, status: "Paid" },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const navigation = useNavigation<MaintenanceScreenNavigationProp>();

  const handlePaymentRedirect = () => {
    // Direct redirection to the payment gateway of the selected method
    if (selectedPaymentMethod === "GPay") {
      Linking.openURL("upi://pay?pa=your@upi&pn=YourName&mc=0000&tid=1234567890&url=https://example.com");
    } else if (selectedPaymentMethod === "PhonePe") {
      Linking.openURL("upi://pay?pa=your@upi&pn=YourName&mc=0000&tid=1234567890&url=https://example.com");
    } else if (selectedPaymentMethod === "Paytm") {
      Linking.openURL("paytm://pay?pa=your@upi&pn=YourName&mc=0000&tid=1234567890&url=https://example.com");
    }
  };

  // Check if any bill has an amount greater than 0
  const hasUnpaidBills = bills.some((bill) => bill.amount > 0);

  // Calculate total amount of unpaid bills
  const totalAmountDue = bills.reduce((total, bill) => total + bill.amount, 0);

  const handlePayNow = (method: string) => {
    setSelectedPaymentMethod(method);
    handlePaymentRedirect(); // Automatically trigger the redirect
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Billing Dashboard</Text>

        {/* Client Information */}
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Name:</Text>
            <Text style={styles.tableData}>{client.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>House Number:</Text>
            <Text style={styles.tableData}>{client.houseNumber}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Phone Number:</Text>
            <Text style={styles.tableData}>{client.phoneNumber}</Text>
          </View>
        </View>

        {/* Bills Section */}
        <Text style={styles.sectionTitle}>Bills</Text>
        <View style={styles.billTableContainer}>
          {/* Fixed-structure table with straight vertical line */}
          <View style={styles.billTable}>
            {/* Table Header */}
            <View style={styles.billTableHeader}>
              <Text style={styles.billTypeHeader}>Bill Type</Text>
              <Text style={styles.billAmountHeader}>Amount</Text>
            </View>
            
            {/* Table Body */}
            <View style={styles.billTableBody}>
              {bills.map((bill) => (
                <View key={bill.id} style={styles.billTableRow}>
                  <Text style={styles.billType}>{bill.type}</Text>
                  <Text style={styles.billAmount}>₹{bill.amount}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Vertical Line - Positioned absolutely */}
          <View style={styles.verticalDivider} />
        </View>

        {/* Total Amount Due and Pay Button */}
        <View style={styles.footer}>
          {hasUnpaidBills ? (
            <>
              <Text style={styles.totalAmountText}>Total Amount Due: ₹{totalAmountDue}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => handlePayNow("GPay")}
                >
                  <Text style={styles.buttonText}>PAY NOW</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.paidButtonContainer}>
              <Text style={styles.paidText}>PAID</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles using StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF3F6",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
    width: "40%",
    padding: 10,
  },
  tableData: {
    fontSize: 16,
    width: "60%",
    padding: 10,
  },
  billTableContainer: {
    position: "relative",
    marginBottom: 20,
  },
  billTable: {
    borderWidth: 1,
    borderColor: "black",
  },
  billTableHeader: {
    flexDirection: "row",
    backgroundColor: "#9CCAD8",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  billTypeHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: "50%",
    paddingVertical: 10,
  },
  billAmountHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: "50%",
    paddingVertical: 10,
  },
  billTableBody: {
    width: "100%",
  },
  billTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  billType: {
    fontSize: 16,
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  billAmount: {
    fontSize: 16,
    width: "50%",
    textAlign: "center",
    paddingVertical: 10,
  },
  verticalDivider: {
    position: "absolute",
    width: 1,
    backgroundColor: "black",
    top: 0,
    bottom: 0,
    left: "50%",
    zIndex: 1,
  },
  footer: {
    marginTop: 10,
    alignItems: "center",
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customButton: {
    backgroundColor: "#9CCAD8",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
  },
  paidButtonContainer: {
    backgroundColor: "#9CCAD8",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 15,  // Increase padding to make it taller
    paddingHorizontal: 30,
    width: "80%", // You can adjust this value to control the button width
    marginTop: 10,
  },
  paidText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
});

export default MaintenanceScreen;