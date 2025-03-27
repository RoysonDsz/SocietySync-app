import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Building, Users, MapPin, Calendar, Bell, BarChart, FileText } from 'lucide-react-native';
import { Shield } from 'lucide-react-native';


const BuildingPage = ({ route, navigation }:any) => {
  const { building } = route.params;

  const handleBlockPress = (block:any) => {
    navigation.navigate('ResidentList', { 
      building,
      selectedBlock: block.name
    });
  };

  const handleViewVisitorLogs = () => {
    navigation.navigate('VisitorLogs', { building });
  };

  const handleSendNotifications = () => {
    navigation.navigate('SendNotifications', { building });
  };

  const handleExpenseAnalytics = () => {
    navigation.navigate('ExpenseAnalytics', { building });
  };

  const handleResidentReport = () => {
    navigation.navigate('ResidentReport', { building });

  };
  const handleWatchman = () => {
    navigation.navigate('watchmanSignup', { building });

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>{building.name}</Text>
            <Text style={styles.subheading}>{building.address}</Text>
          </View>
        </View>
        
        {/* Info Card Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Building size={20} color="#4361ee" style={styles.infoIcon} />
            <Text style={styles.infoText}>Total Flats: {building.totalFlats}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#4361ee" style={styles.infoIcon} />
            <Text style={styles.infoText}>{building.address}</Text>
          </View>
          {building.president && (
            <View style={styles.infoRow}>
              <Users size={20} color="#4361ee" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                President: {building.president} {building.isAdmin && '(Admin)'}
              </Text>
            </View>
          )}
        </View>

        {/* Blocks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Blocks</Text>
          <Text style={styles.sectionSubtitle}>Tap on a block to view its residents</Text>
        </View>
        
        <FlatList
          data={building.blocks}
          keyExtractor={(item) => item.name}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.blockRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.blockItem}
              onPress={() => handleBlockPress(item)}
            >
              <Text style={styles.blockName}>Block {item.name}</Text>
              <Text style={styles.flatCount}>{item.flats} Flats</Text>
            </TouchableOpacity>
          )}
        />

        {/* Action Buttons - Improved Section */}
        <View style={styles.actionButtonsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          
           {/* View All Residents Button */}
           <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={() => navigation.navigate('ResidentList', { building })}
          >
            <View style={[styles.iconContainer, styles.residentsIcon]}>
              <Users size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>View All Residents</Text>
              <Text style={styles.actionButtonSubtitle}>See complete resident directory</Text>
            </View>
          </TouchableOpacity>
          {/* Send Notifications Button */}
          <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={handleSendNotifications}
          >
            <View style={[styles.iconContainer, styles.notificationIcon]}>
              <Bell size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>Send Notifications</Text>
              <Text style={styles.actionButtonSubtitle}>Broadcast messages to residents</Text>
            </View>
          </TouchableOpacity>

          {/* View Visitor Logs Button */}
          <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={handleViewVisitorLogs}
          >
            <View style={[styles.iconContainer, styles.visitorLogIcon]}>
              <Calendar size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>View Visitor Logs</Text>
              <Text style={styles.actionButtonSubtitle}>Check recent building visitors</Text>
            </View>
          </TouchableOpacity>
          
        
        </View>

        {/* Analytics & Reports Section */}
        <View style={styles.actionButtonsContainer}>
          
          {/* Expense Analytics Button */}
          <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={handleExpenseAnalytics}
          >
            <View style={[styles.iconContainer, styles.analyticsIcon]}>
              <BarChart size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>Expense Analytics</Text>
              <Text style={styles.actionButtonSubtitle}>Track maintenance expenses and budgets</Text>
            </View>
          </TouchableOpacity>

          {/* Resident Report Button */}
          <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={handleResidentReport}
          >
            <View style={[styles.iconContainer, styles.reportIcon]}>
              <FileText size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>Resident Report</Text>
              <Text style={styles.actionButtonSubtitle}>Generate detailed resident activity reports</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonOuter}
            onPress={handleWatchman}
          >
            <View style={[styles.iconContainer, styles.watchmanIcon]}>
            <Shield size={22} color="#fff" />
            </View>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.actionButtonTitle}>Watchman Report</Text>
              <Text style={styles.actionButtonSubtitle}>Manage security staff and schedules</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#4361ef',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  headerContent: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  blockRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  blockItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4361ee',
  },
  blockName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  flatCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Action Button Styles
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
  },
  actionButtonOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationIcon: {
    backgroundColor: '#f44336',
  },
  visitorLogIcon: {
    backgroundColor: '#4caf50',
  },
  residentsIcon: {
    backgroundColor: '#4361ee',
  },
  analyticsIcon: {
    backgroundColor: '#ff9800',
  },
  reportIcon: {
    backgroundColor: '#9c27b0',
  },
  watchmanIcon: {
    backgroundColor: '#ff5722', // Choose a unique color for the watchman button
  },
  
  buttonTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default BuildingPage;