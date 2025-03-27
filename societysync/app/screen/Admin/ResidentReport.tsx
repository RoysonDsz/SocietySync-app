import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { Users, FileText, Filter, Search, User, Calendar, CheckCircle, XCircle, Download, Share } from 'lucide-react-native';

// Sample data - in a real app, this would come from an API or database
const generateSampleData = (building:any) => {
  return {
    totalResidents: 158,
    activeResidents: 152,
    residentsWithComplaints: 8,
    residentsWithDues: 12,
    newResidentsLastMonth: 5,
    residentActivities: [
      { id: 1, name: "Jane Smith", flat: "A-101", activity: "Registered complaint", status: "Open", date: "2025-03-18" },
      { id: 2, name: "John Doe", flat: "B-205", activity: "Paid maintenance dues", status: "Completed", date: "2025-03-15" },
      { id: 3, name: "Sarah Johnson", flat: "C-302", activity: "Requested guest parking", status: "Approved", date: "2025-03-12" },
      { id: 4, name: "Michael Brown", flat: "A-402", activity: "Updated contact information", status: "Completed", date: "2025-03-10" },
      { id: 5, name: "Emily Wilson", flat: "B-104", activity: "Reported maintenance issue", status: "In Progress", date: "2025-03-08" },
    ],
    recentComplaints: [
      { id: 1, resident: "Jane Smith", flat: "A-101", issue: "Water leakage in bathroom", status: "Open", date: "2025-03-18" },
      { id: 2, resident: "Emily Wilson", flat: "B-104", issue: "Elevator malfunction", status: "In Progress", date: "2025-03-08" },
      { id: 3, resident: "Robert Chen", flat: "C-201", issue: "Noise complaint from B-202", status: "Under Investigation", date: "2025-03-05" },
    ],
    pendingDues: [
      { id: 1, resident: "Alex Johnson", flat: "A-303", amount: 1200, dueDate: "2025-03-31", lastReminder: "2025-03-15" },
      { id: 2, resident: "Maria Garcia", flat: "B-103", amount: 850, dueDate: "2025-03-31", lastReminder: "2025-03-15" },
      { id: 3, resident: "David Kim", flat: "C-404", amount: 1500, dueDate: "2025-03-31", lastReminder: "2025-03-15" },
    ]
  };
};

const ResidentReport = ({ route, navigation }:any) => {
  const { building, newItem = null } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, complaints, dues, activities
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = generateSampleData(building);
      
      // Handle new items being added
      if (newItem) {
        // Determine which data array to update based on newItem type
        if (newItem.type === 'complaint') {
          data.recentComplaints = [newItem.data, ...data.recentComplaints];
          data.residentsWithComplaints += 1;
          setFilterType('complaints'); // Automatically switch to complaints filter
        } else if (newItem.type === 'due') {
          data.pendingDues = [newItem.data, ...data.pendingDues];
          data.residentsWithDues += 1; 
          setFilterType('dues'); // Automatically switch to dues filter
        } else if (newItem.type === 'activity') {
          data.residentActivities = [newItem.data, ...data.residentActivities];
          setFilterType('activities'); // Automatically switch to activities filter
        }
      }
      
      setReportData(data);
      setLoading(false);
    }, 1000);
  }, [building, newItem]);

  // Function to handle adding new items to the report
  const handleAddItem = (itemType:any, itemData:any) => {
    // Navigate to the same screen with new item data
    navigation.navigate('ResidentReport', {
      building,
      newItem: {
        type: itemType,
        data: itemData
      }
    });
  };

  // Function to handle action buttons
  const handleAction = (actionType:any, itemId:any, itemType:any) => {
    const updatedData = { ...reportData };
    
    if (actionType === 'sendReminder' && itemType === 'due') {
      // Update the last reminder date for the specific due
      const dueIndex = updatedData.pendingDues.findIndex((due: { id: any; }) => due.id === itemId);
      if (dueIndex !== -1) {
        updatedData.pendingDues[dueIndex].lastReminder = new Date().toISOString().split('T')[0];
        setReportData(updatedData);
      }
    } else if (actionType === 'markPaid' && itemType === 'due') {
      // Remove the due from pending dues
      updatedData.pendingDues = updatedData.pendingDues.filter((due: { id: any; }) => due.id !== itemId);
      updatedData.residentsWithDues -= 1;
      
      // Add a new activity for payment
      const due = reportData.pendingDues.find((due: { id: any; }) => due.id === itemId);
      if (due) {
        const newActivity = {
          id: Date.now(),
          name: due.resident,
          flat: due.flat,
          activity: `Paid maintenance dues of ₹${due.amount}`,
          status: "Completed",
          date: new Date().toISOString().split('T')[0]
        };
        updatedData.residentActivities = [newActivity, ...updatedData.residentActivities];
      }
      
      setReportData(updatedData);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Generating resident report...</Text>
      </SafeAreaView>
    );
  }

  // Filter functionality based on search query
  const filterData = (data : any, query:any) => {
    if (!query) return data;
    const lowerCaseQuery = query.toLowerCase();
    
    return {
      ...data,
      residentActivities: data.residentActivities.filter(
        (item: any) => item.name.toLowerCase().includes(lowerCaseQuery) || 
                item.flat.toLowerCase().includes(lowerCaseQuery)
      ),
      recentComplaints: data.recentComplaints.filter(
        (item: any) => item.resident.toLowerCase().includes(lowerCaseQuery) || 
                item.flat.toLowerCase().includes(lowerCaseQuery) ||
                item.issue.toLowerCase().includes(lowerCaseQuery)
      ),
      pendingDues: data.pendingDues.filter(
        (item: any) => item.resident.toLowerCase().includes(lowerCaseQuery) || 
                item.flat.toLowerCase().includes(lowerCaseQuery)
      )
    };
  };

  const filteredData = filterData(reportData, searchQuery);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>Resident Report</Text>
            <Text style={styles.subheading}>{building?.name || 'All Buildings'}</Text>
          </View>
        </View>
        
        {/* Report Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#4361ee" />
            <Text style={styles.actionText}>Export Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#4361ee" />
            <Text style={styles.actionText}>Share Report</Text>
          </TouchableOpacity>
        </View>
        
        {/* Resident Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={20} color="#4361ee" />
            </View>
            <Text style={styles.statCount}>{filteredData.totalResidents}</Text>
            <Text style={styles.statLabel}>Total Residents</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.alertIconContainer]}>
              <XCircle size={20} color="#f44336" />
            </View>
            <Text style={styles.statCount}>{filteredData.residentsWithComplaints}</Text>
            <Text style={styles.statLabel}>With Complaints</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.warningIconContainer]}>
              <Calendar size={20} color="#ff9800" />
            </View>
            <Text style={styles.statCount}>{filteredData.residentsWithDues}</Text>
            <Text style={styles.statLabel}>With Pending Dues</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.successIconContainer]}>
              <User size={20} color="#4caf50" />
            </View>
            <Text style={styles.statCount}>{filteredData.newResidentsLastMonth}</Text>
            <Text style={styles.statLabel}>New This Month</Text>
          </View>
        </View>
        
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resident or flat"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'all' && styles.activeFilterChip]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[styles.filterChipText, filterType === 'all' && styles.activeFilterChipText]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'complaints' && styles.activeFilterChip]}
              onPress={() => setFilterType('complaints')}
            >
              <Text style={[styles.filterChipText, filterType === 'complaints' && styles.activeFilterChipText]}>Complaints</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'dues' && styles.activeFilterChip]}
              onPress={() => setFilterType('dues')}
            >
              <Text style={[styles.filterChipText, filterType === 'dues' && styles.activeFilterChipText]}>Pending Dues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filterType === 'activities' && styles.activeFilterChip]}
              onPress={() => setFilterType('activities')}
            >
              <Text style={[styles.filterChipText, filterType === 'activities' && styles.activeFilterChipText]}>Activities</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Show filtered content based on selected filter */}
        {(filterType === 'all' || filterType === 'activities') && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recent Resident Activities</Text>
            
            {filteredData.residentActivities.map((activity:any, index:any) => (
              <View key={activity.id || index} style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{activity.name}</Text>
                    <Text style={styles.flatNumber}>{activity.flat}</Text>
                  </View>
                  <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
                </View>
                
                <Text style={styles.activityDescription}>{activity.activity}</Text>
                
                <View style={styles.activityFooter}>
                  <View style={[styles.statusBadge, getStatusStyle(activity.status)]}>
                    <Text style={styles.statusText}>{activity.status}</Text>
                  </View>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('AllActivities', { activities: reportData.residentActivities })}
            >
              <Text style={styles.viewAllText}>View All Activities</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {(filterType === 'all' || filterType === 'complaints') && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            
            {filteredData.recentComplaints.map((complaint:any, index:any) => (
              <View key={complaint.id || index} style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{complaint.resident}</Text>
                    <Text style={styles.flatNumber}>{complaint.flat}</Text>
                  </View>
                  <Text style={styles.activityDate}>{formatDate(complaint.date)}</Text>
                </View>
                
                <Text style={styles.activityDescription}>{complaint.issue}</Text>
                
                <View style={styles.activityFooter}>
                  <View style={[styles.statusBadge, getStatusStyle(complaint.status)]}>
                    <Text style={styles.statusText}>{complaint.status}</Text>
                  </View>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('AllComplaints', { complaints: reportData.recentComplaints })}
            >
              <Text style={styles.viewAllText}>View All Complaints</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {(filterType === 'all' || filterType === 'dues') && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pending Dues</Text>
            
            {filteredData.pendingDues.map((due:any, index:any) => (
              <View key={due.id || index} style={styles.dueItem}>
                <View style={styles.activityHeader}>
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{due.resident}</Text>
                    <Text style={styles.flatNumber}>{due.flat}</Text>
                  </View>
                  <Text style={styles.dueAmount}>₹{due.amount}</Text>
                </View>
                
                <View style={styles.dueInfoRow}>
                  <Text style={styles.dueLabel}>Due Date:</Text>
                  <Text style={styles.dueValue}>{formatDate(due.dueDate)}</Text>
                </View>
                
                <View style={styles.dueInfoRow}>
                  <Text style={styles.dueLabel}>Last Reminder:</Text>
                  <Text style={styles.dueValue}>{formatDate(due.lastReminder)}</Text>
                </View>
                
                <View style={styles.dueActions}>
                  <TouchableOpacity 
                    style={styles.dueActionButton}
                    onPress={() => handleAction('sendReminder', due.id, 'due')}
                  >
                    <Text style={styles.dueActionText}>Send Reminder</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.dueActionButton}
                    onPress={() => handleAction('markPaid', due.id, 'due')}
                  >
                    <Text style={styles.dueActionText}>Mark as Paid</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('AllDues', { dues: reportData.pendingDues })}
            >
              <Text style={styles.viewAllText}>View All Pending Dues</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions
const formatDate = (dateString:any) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getStatusStyle = (status:any) => {
  switch (status.toLowerCase()) {
    case 'open':
      return styles.statusOpen;
    case 'completed':
      return styles.statusCompleted;
    case 'approved':
      return styles.statusApproved;
    case 'in progress':
      return styles.statusInProgress;
    case 'under investigation':
      return styles.statusInvestigation;
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4361ef',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#4361ee',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8eaff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIconContainer: {
    backgroundColor: '#ffebee',
  },
  warningIconContainer: {
    backgroundColor: '#fff3e0',
  },
  successIconContainer: {
    backgroundColor: '#e8f5e9',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterChip: {
    backgroundColor: '#4361ee',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
    fontWeight: '500',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flatNumber: {
    fontSize: 14,
    color: '#666',
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  statusOpen: {
    backgroundColor: '#ffebee',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusApproved: {
    backgroundColor: '#e3f2fd',
  },
  statusInProgress: {
    backgroundColor: '#fff3e0',
  },
  statusInvestigation: {
    backgroundColor: '#f3e5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4361ee',
    fontWeight: '500',
  },
  dueItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  dueAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  dueInfoRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  dueLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  dueValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dueActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dueActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  dueActionText: {
    fontSize: 12,
    color: '#4361ee',
    fontWeight: '500',
  },
});

export default ResidentReport;