import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, AlertTriangle, Send, Info, Calendar, Shield, Coffee, X } from 'lucide-react-native';
// import {axios} from 'axios';
// Define navigation stack types
type RootStackParamList = {
  SendNotifications: { 
    building: {
      id: string;
      name: string;
      blocks: Array<{ name: string; flats: number }>;
    };
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'SendNotifications'>;

const SendNotifications: React.FC<Props> = ({ route, navigation }) => {
  const { building } = route.params;

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  {
  
  }
  useEffect(() => {
    const initialBlocksState: Record<string, boolean> = {};
    building.blocks.forEach(block => {
      initialBlocksState[block.name] = true;
    });
    setSelectedBlocks(initialBlocksState);
  }, [building.blocks]);

  const handleSendNotification = async () => {
    
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a notification title');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a notification message');
      return;
    }

    if (Object.values(selectedBlocks).filter(Boolean).length === 0) {
      Alert.alert('Error', 'Please select at least one block to send notification to');
      return;
    }

    const notificationData = {
      buildingId: building.id,
      title,
      message,
      isUrgent,
      blocks: Object.keys(selectedBlocks).filter(key => selectedBlocks[key]),
      timestamp: new Date().toISOString(),
    };
    
    setLoading(true);

    try {
      {
        /*
        axios.post('https://example.com/api/user', notificationData)
      .then(response => {
          // This block will execute if the request is successful
          console.log('Success:', response.data);
      })
      .catch(error => {
          // This block will execute if there's an error in the request
          console.error('Error:', error);
      });
         */
      }
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      Alert.alert('Success', 'Notification sent successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Bell size={24} color="#ffffff" />
        <Text style={styles.headerTitle}>Send Notifications</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Notification Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title here"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter message here"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendNotification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Send size={20} color="#ffffff" style={styles.sendIcon} />
              <Text style={styles.sendButtonText}>Send Notification</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#4361ee', padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginLeft: 12 },
  formContainer: { padding: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 20 },
  textArea: { height: 120 },
  sendButton: { backgroundColor: '#4361ee', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  sendIcon: { marginRight: 10 },
  sendButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default SendNotifications;
