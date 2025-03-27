import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Plus, Edit, Trash } from 'lucide-react-native';

const VisitorLogs = ({ route, navigation }: any) => {
  const { building } = route.params;

  // Sample visitor logs data (replace with your actual data source)
  const [visitorLogs, setVisitorLogs] = useState([
    { id: '1', visitorName: 'John Doe', date: '2023-10-01', purpose: 'Delivery', contact: '1234567890' },
    { id: '2', visitorName: 'Jane Smith', date: '2023-10-02', purpose: 'Guest', contact: '9876543210' },
    { id: '3', visitorName: 'Alice Johnson', date: '2023-10-03', purpose: 'Service', contact: '5555555555' },
  ]);

  // Handle adding a new visitor log
  const handleAddVisitorLog = () => {
    navigation.navigate('AddVisitorLog', { building });
  };

  // Handle editing a visitor log
  const handleEditVisitorLog = (log: any) => {
    navigation.navigate('EditVisitorLog', { building, log });
  };

  // Handle deleting a visitor log
  const handleDeleteVisitorLog = (id: string) => {
    Alert.alert(
      'Delete Visitor Log',
      'Are you sure you want to delete this visitor log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setVisitorLogs(visitorLogs.filter((log) => log.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Visitor Logs</Text>
        <Text style={styles.subheading}>{building.name}</Text>
      </View>

      {/* Add Visitor Log Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddVisitorLog}>
        <Plus size={18} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Add Visitor Log</Text>
      </TouchableOpacity>

      {/* Visitor Logs List */}
      <FlatList
        data={visitorLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <View style={styles.logContent}>
              <Text style={styles.visitorName}>{item.visitorName}</Text>
              <Text style={styles.logText}>Date: {item.date}</Text>
              <Text style={styles.logText}>Purpose: {item.purpose}</Text>
              <Text style={styles.logText}>Contact: {item.contact}</Text>
            </View>
            <View style={styles.logActions}>
              <TouchableOpacity onPress={() => handleEditVisitorLog(item)}>
                <Edit size={18} color="#4361ee" style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteVisitorLog(item.id)}>
                <Trash size={18} color="#ff4444" style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#4361ee',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  logItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logContent: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  logText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  logActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default VisitorLogs;