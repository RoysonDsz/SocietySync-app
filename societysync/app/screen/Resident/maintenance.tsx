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
  TouchableOpacity,
  ImageBackground
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
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`https://vt92g6tf-5050.inc1.devtunnels.ms/api/user/ownProfile`, {
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
    { id: "5", type: "Building Maintenance Bill", amount: 0, status: "Paid" },
    { id: "6", type: "Facility Maintenance Bill", amount: 0, status: "Paid" },
    { id: "7", type: "Equipment Maintenance Bill", amount: 0, status: "Paid" },
  ]);

  const navigation = useNavigation<MaintenanceScreenNavigationProp>();

  const handlePayWithRazorpay = () => {
    Linking.openURL("https://rzp.io/i/example-payment-link"); // Replace with actual Razorpay payment link
  };

  const hasUnpaidBills = bills.some((bill) => bill.amount > 0);
  const totalAmountDue = bills.reduce((total, bill) => total + bill.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Billing Dashboard</Text>
          <View style={styles.headerUnderline} />
        </View>

        {/* Client Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.clientInfoContainer}>
            <View style={styles.clientInfoItem}>
              <Text style={styles.clientInfoLabel}>Name</Text>
              <Text style={styles.clientInfoValue}>{client?.name || 'Not available'}</Text>
            </View>
            <View style={styles.clientInfoSeparator} />
            <View style={styles.clientInfoItem}>
              <Text style={styles.clientInfoLabel}>House Number</Text>
              <Text style={styles.clientInfoValue}>{client?.houseNumber || 'Not available'}</Text>
            </View>
            <View style={styles.clientInfoSeparator} />
            <View style={styles.clientInfoItem}>
              <Text style={styles.clientInfoLabel}>Phone Number</Text>
              <Text style={styles.clientInfoValue}>{client?.phoneNumber || 'Not available'}</Text>
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
                  <View style={styles.amountContainer}>
                    <Text style={[ 
                      styles.billAmount, 
                      bill.amount > 0 ? styles.unpaidAmount : styles.paidAmount
                    ]}>
                      ₹{bill.amount}
                    </Text>
                    {bill.amount === 0 && (
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidBadgeText}>PAID</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Total Amount Due and Pay Button */}
          <View style={styles.footer}>
            {hasUnpaidBills ? (
              <>
                <View style={styles.totalAmountContainer}>
                  <Text style={styles.totalAmountLabel}>Total Amount Due:</Text>
                  <Text style={styles.totalAmountValue}>₹{totalAmountDue}</Text>
                </View>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={handlePayWithRazorpay}
                >
                  <Text style={styles.paymentButtonText}>Pay Now</Text>
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

// Enhanced Blue Color Scheme
const Colors = {
  primary: "#1A73E8", // Google Blue
  primaryDark: "#0D47A1", // Darker blue for accents
  primaryLight: "#BBDEFB", // Light blue for backgrounds
  secondary: "#2196F3", // Slightly different blue
  background: "#EBF5FB", // Very light blue background
  card: "#FFFFFF", // White for cards
  text: "#202124", // Dark gray for main text
  textSecondary: "#5F6368", // Secondary text color
  border: "#E1E3E6", // Light gray border
  success: "#0F9D58", // Google Green
  unpaid: "#EA4335", // Google Red
  white: "#FFFFFF", // White
  lightBlue: "#E3F2FD", // Light blue for alternating rows
  mediumBlue: "#90CAF9", // Medium blue
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
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 2,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 20,
  },
  clientInfoContainer: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 16,
    padding: 16,
  },
  clientInfoItem: {
    paddingVertical: 12,
  },
  clientInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  clientInfoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  clientInfoSeparator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  billTableContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billTableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  billTypeHeader: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
    width: "60%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: Colors.white,
  },
  billAmountHeader: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    width: "40%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: Colors.white,
  },
  billTableBody: {
    width: "100%",
  },
  billTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 16,
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: Colors.lightBlue,
  },
  oddRow: {
    backgroundColor: Colors.card,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  billType: {
    fontSize: 16,
    width: "60%",
    paddingLeft: 20,
    color: Colors.text,
    fontWeight: "500",
  },
  amountContainer: {
    width: "40%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  unpaidAmount: {
    color: Colors.unpaid,
  },
  paidAmount: {
    color: Colors.success,
  },
  paidBadge: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  paidBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  footer: {
    marginTop: 28,
    alignItems: "center",
  },
  totalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  totalAmountLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginRight: 8,
  },
  totalAmountValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primaryDark,
  },
  paymentButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  paymentButtonText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "700",
  },
  paidButtonContainer: {
    backgroundColor: Colors.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0A7D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  paidText: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
  },
});

export default MaintenanceScreen;