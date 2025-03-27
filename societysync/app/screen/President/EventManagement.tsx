import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Platform, Alert, FlatList, ActivityIndicator,
  RefreshControl, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
interface EventData {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
}

interface Booking {
  id: string;
  amenityName: string;
  userName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'declined';
  
  purpose: string;
}

const EventManagement: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  // AddEvent state
  const [event, setEvent] = useState<EventData>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ManageBookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  // Categories for events
  const categories = ['Festival', 'Meeting', 'Workshop', 'Conference', 'Social', 'Other'];

  // Sample booking data
  const mockBookings: Booking[] = [
    {
      id: '1',
      amenityName: 'Conference Room A',
      userName: 'John Smith',
      startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(new Date().getTime() + 26 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      
      purpose: 'Team meeting',
    },
    {
      id: '2',
      amenityName: 'Auditorium',
      userName: 'Emma Johnson',
      startTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(new Date().getTime() + 52 * 60 * 60 * 1000).toISOString(),
      status: 'approved',
      
      purpose: 'Department presentation',
    },
    {
      id: '3',
      amenityName: 'Garden Area',
      userName: 'Michael Chen',
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString(),
      status: 'declined',
     
      purpose: 'Birthday celebration',
    }
  ];

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
    // Load any saved events from storage/API in a real app
  }, []);

  // AddEvent methods
  const handleInputChange = (field: keyof EventData, value: string) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!event.title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return false;
    }
    
    if (!event.location.trim()) {
      Alert.alert('Error', 'Event location is required');
      return false;
    }
    
    if (new Date(event.startDate) >= new Date(event.endDate)) {
      Alert.alert('Error', 'End time must be after start time');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a new event with an ID
      const newEvent = {
        ...event,
        id: Date.now().toString() // Simple ID generation
      };
      
      // Add event to bookings list automatically
      const newBooking: Booking = {
        id: Date.now().toString(),
        amenityName: event.location,
        userName: 'Current User', // In a real app, this would be the logged-in user
        
        startTime: event.startDate,
        endTime: event.endDate,
        status: 'pending',
        purpose: event.title + (event.description ? ` - ${event.description}` : '')
      };
      
      // Update both events and bookings (for demonstration)
      setEvents(prev => [...prev, newEvent]);
      setBookings(prev => [...prev, newBooking]);
      
      Alert.alert(
        'Success',
        'Event added successfully!',
        [{ text: 'OK', onPress: () => {
          handleReset();
          setActiveTab('manage'); // Switch to manage tab to see the new booking
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEvent({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      category: '',
    });
  };

  // ManageBookings methods
  const fetchBookings = async () => {
    // Simulate API call with a delay
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleApprove = (id: string) => {
    Alert.alert(
      'Confirm Approval',
      'Are you sure you want to approve this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setBookings(prev => 
              prev.map(booking => 
                booking.id === id 
                  ? { ...booking, status: 'approved' } 
                  : booking
              )
            );
            Alert.alert('Success', 'Booking has been approved');
          }
        }
      ]
    );
  };

  const handleDecline = (id: string) => {
    Alert.alert(
      'Confirm Decline',
      'Are you sure you want to decline this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          onPress: () => {
            setBookings(prev => 
              prev.map(booking => 
                booking.id === id 
                  ? { ...booking, status: 'declined' } 
                  : booking
              )
            );
            Alert.alert('Success', 'Booking has been declined');
          }
        }
      ]
    );
  };

  // Utility methods
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtered bookings based on selected filter
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Render booking item
  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isPending = item.status === 'pending';
    const isApproved = item.status === 'approved';
    const isDeclined = item.status === 'declined';

    return (
      <View style={[
        styles.bookingCard,
        isApproved && styles.approvedCard,
        isDeclined && styles.declinedCard
      ]}>
        <View style={styles.bookingHeader}>
          <Text style={styles.amenityName}>{item.amenityName}</Text>
          <View style={[
            styles.statusBadge,
            isApproved && styles.approvedBadge,
            isDeclined && styles.declinedBadge
          ]}>
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.bookingInfo}>
            <Ionicons name="person-outline" size={16} color="#555" style={styles.icon} />
            <Text style={styles.detailText}>{item.userName}</Text>
          </View>
          
          

          <View style={styles.bookingInfo}>
            <Ionicons name="time-outline" size={16} color="#555" style={styles.icon} />
            <Text style={styles.detailText}>
              {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
            </Text>
          </View>

          <View style={styles.bookingInfo}>
            <Ionicons name="information-circle-outline" size={16} color="#555" style={styles.icon} />
            <Text style={styles.detailText}>{item.purpose}</Text>
          </View>
        </View>

        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]} 
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.declineButton]} 
              onPress={() => handleDecline(item.id)}
            >
              <Ionicons name="close-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render AddEvent tab content
  const renderAddEventTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Title*</Text>
          <TextInput
            style={styles.input}
            value={event.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="Enter event title"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={event.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Enter event description"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location*</Text>
          <TextInput
            style={styles.input}
            value={event.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="Enter event location"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  event.category === category && styles.selectedCategory,
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Text 
                  style={[
                    styles.categoryText, 
                    event.category === category && styles.selectedCategoryText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Date & Time*</Text>
          <TextInput
            style={styles.input}
            value={event.startDate}
            onChangeText={(value) => handleInputChange('startDate', value)}
            placeholder="YYYY-MM-DD HH:MM"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>End Date & Time*</Text>
          <TextInput
            style={styles.input}
            value={event.endDate}
            onChangeText={(value) => handleInputChange('endDate', value)}
            placeholder="YYYY-MM-DD HH:MM"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.submitButton]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Event</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
            disabled={isSubmitting}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Render ManageBookings tab content
  const renderManageBookingsTab = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]} 
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]} 
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>Pending</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'approved' && styles.activeFilter]} 
            onPress={() => setFilter('approved')}
          >
            <Text style={[styles.filterText, filter === 'approved' && styles.activeFilterText]}>Approved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'declined' && styles.activeFilter]} 
            onPress={() => setFilter('declined')}
          >
            <Text style={[styles.filterText, filter === 'declined' && styles.activeFilterText]}>Declined</Text>
          </TouchableOpacity>
        </View>

        {filteredBookings.length === 0 ? (
          <View style={styles.noBookings}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.noBookingsText}>No bookings found</Text>
            <Text style={styles.noBookingsSubText}>
              {filter === 'all' 
                ? 'There are no bookings to display' 
                : `There are no ${filter} bookings`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    );
  };

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Event Management</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]} 
          onPress={() => setActiveTab('add')}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={22} 
            color={activeTab === 'add' ? '#3498db' : '#555'} 
          />
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
            Add Event
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'manage' && styles.activeTab]} 
          onPress={() => setActiveTab('manage')}
        >
          <Ionicons 
            name="calendar-outline" 
            size={22} 
            color={activeTab === 'manage' ? '#3498db' : '#555'} 
          />
          <Text style={[styles.tabText, activeTab === 'manage' && styles.activeTabText]}>
            Manage Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'add' ? renderAddEventTab() : renderManageBookingsTab()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Tab navigation styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#555',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  // Form styles
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 30,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3498db',
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resetButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
  // Booking list styles
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12', // pending color
  },
  approvedCard: {
    borderLeftColor: '#2ecc71', // approved color
  },
  declinedCard: {
    borderLeftColor: '#e74c3c', // declined color
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  amenityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f39c12', // pending color
  },
  approvedBadge: {
    backgroundColor: '#2ecc71', // approved color
  },
  declinedBadge: {
    backgroundColor: '#e74c3c', // declined color
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  bookingDetails: {
    padding: 12,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  approveButton: {
    backgroundColor: '#2ecc71',
    borderBottomLeftRadius: 8,
  },
  declineButton: {
    backgroundColor: '#e74c3c',
    borderBottomRightRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  noBookings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  noBookingsText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
    fontWeight: '500',
  },
  noBookingsSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default EventManagement;
