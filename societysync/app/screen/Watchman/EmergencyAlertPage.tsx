import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  SafeAreaView, 
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface EmergencyMessage {
  id: number;
  title: string;
  message: string;
  level: 'fire' | 'maintenance' | 'security' | 'medical' | 'other';
  location: string;
  timestamp: string;
}

export default function App() {
  // Define the same color constants as in ResidentLogBook
  const primaryBlue = '#180DC9';
  const primaryCyan = '#06D9E0';

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    level: 'fire' as 'fire' | 'maintenance' | 'security' | 'medical' | 'other',
    location: '',
  });
  
  const [alerts, setAlerts] = useState<EmergencyMessage[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleSubmit = () => {
    if (!formData.title || !formData.message || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newAlert: EmergencyMessage = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      level: formData.level,
      location: formData.location,
      timestamp: new Date().toISOString()
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Reset form
    setFormData({
      title: '',
      message: '',
      level: 'fire',
      location: '',
    });
  };
  
  const dismissNotification = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'fire': return '#f44336'; // Red for fire
      case 'maintenance': return '#ff9800'; // Yellow for maintenance
      case 'security': return '#2196f3'; // Blue for security
      case 'medical': return '#4caf50'; // Green for medical
      case 'other': return '#9e9e9e'; // Gray for other
      default: return '#2196f3'; // Default blue
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={primaryBlue} barStyle="light-content" />
      
      {/* Updated LinearGradient with the same colors as the ResidentLogBook */}
      <LinearGradient
        colors={[primaryCyan, primaryBlue]}
        style={styles.navbar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.logo}>Emergency Alert System</Text>
        <TouchableOpacity 
          style={styles.notificationIcon} 
          onPress={() => setShowNotifications(!showNotifications)}
        >
          <Text style={{fontSize: 24}}>🔔</Text>
          {alerts.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{alerts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Emergency Alert</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Alert Title*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter alert title"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Alert Message*</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the emergency situation in detail..."
              multiline
              numberOfLines={4}
              value={formData.message}
              onChangeText={(text) => setFormData({...formData, message: text})}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Alert Level*</Text>
            <View style={styles.levelSelector}>
              {['fire', 'security', 'medical'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[ 
                    styles.levelButton, 
                    formData.level === level && { backgroundColor: getLevelColor(level) } 
                  ]}
                  onPress={() => setFormData({
                    ...formData, 
                    level: level as 'fire' | 'maintenance' | 'security' | 'medical' | 'other'
                  })}
                >
                  <Text style={[ 
                    styles.levelButtonText, 
                    formData.level === level && { color: 'white' } 
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Maintenance and Other on new line */}
            <View style={styles.levelSelector}>
              {['maintenance', 'other'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[ 
                    styles.levelButton, 
                    formData.level === level && { backgroundColor: getLevelColor(level) } 
                  ]}
                  onPress={() => setFormData({
                    ...formData, 
                    level: level as 'fire' | 'maintenance' | 'security' | 'medical' | 'other'
                  })}
                >
                  <Text style={[ 
                    styles.levelButtonText, 
                    formData.level === level && { color: 'white' } 
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Location*</Text>
            <TextInput
              style={styles.input}
              placeholder="Specify affected location"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
          </View>
          
          {/* Updated LinearGradient with the same colors as the ResidentLogBook */}
          <LinearGradient
            colors={[primaryCyan, primaryBlue]}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity style={styles.submitButtonContent} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Emergency Alert</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationPanel}>
            {/* Updated LinearGradient with the same colors as the ResidentLogBook */}
            <LinearGradient
              colors={[primaryCyan, primaryBlue]}
              style={styles.notificationHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.notificationTitle}>Active Alerts</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <ScrollView style={styles.notificationList}>
              {alerts.length === 0 ? (
                <Text style={styles.noAlerts}>No active alerts</Text>
              ) : (
                alerts.map(alert => (
                  <View 
                    key={alert.id} 
                    style={[ 
                      styles.notificationItem, 
                      { borderLeftColor: getLevelColor(alert.level) }
                    ]}
                  >
                    <View style={styles.notificationItemHeader}>
                      <Text style={styles.notificationItemTitle}>{alert.title}</Text>
                      <TouchableOpacity 
                        style={styles.dismissButton} 
                        onPress={() => dismissNotification(alert.id)}
                      >
                        <Text>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.notificationMessage}>{alert.message}</Text>
                    <Text style={styles.notificationTime}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  navbar: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4169E1',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#180DC9', // Updated to match primaryBlue
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  levelButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 2,
    borderRadius: 4,
    marginBottom: 8, // Add spacing between rows
  },
  levelButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 4,
  },
  submitButtonContent: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationPanel: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    fontSize: 18,
    padding: 4,
    color: 'white',
  },
  notificationList: {
    padding: 16,
  },
  noAlerts: {
    textAlign: 'center',
    padding: 16,
    color: '#777',
  },
  notificationItem: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderLeftWidth: 4,
  },
  notificationItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dismissButton: {
    padding: 4,
  },
  notificationMessage: {
    marginBottom: 8,
  },
  notificationTime: {
    color: '#777',
    fontSize: 12,
  },
});