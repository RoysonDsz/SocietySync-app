import axios from 'axios';
import { Building, Home, MapPin, Plus, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddBuildingProps {
  onAdd: (building: Building) => void;
}

interface Building {
  ownerName: string;
  presidentName: string;
  numberOfFlats: string;
  buildingNumber: string;
  location: string;
  buildingName: string;
}

const AddBuilding: React.FC<AddBuildingProps> = ({ onAdd }) => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [flats, setFlats] = useState<string>('');
  const [presidentName, setPresidentName] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');
  const [buildingNumber, setBuildingNumber] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAdd = () => {
    if (!name || !address || !flats || !presidentName || !buildingName || !buildingNumber) {
      Alert.alert(
        'Incomplete Information', 
        'Please fill in all fields before adding a building.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const newBuilding: Building = {
      ownerName: name,
      presidentName: presidentName,
      numberOfFlats: flats,
      buildingNumber: buildingNumber,
      location: address,
      buildingName: buildingName
    };

    axios.post('https://mrnzp03x-5050.inc1.devtunnels.ms/api/building/create', newBuilding)
      .then((response) => {
        setName('');
        setAddress('');
        setFlats('');
        setPresidentName('');
        setBuildingName('');
        setBuildingNumber('');
        setIsExpanded(false);
        onAdd(response.data);
      })
      .catch((error) => {
        console.error('Error adding building:', error);
        Alert.alert('Error', 'Failed to add new building.');
      });
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity 
        style={styles.collapsedCard} 
        onPress={() => setIsExpanded(true)}
        activeOpacity={0.8}
      >
        <View style={styles.collapsedContent}>
          <Plus size={20} color="#fff" style={styles.plusIcon} />
          <Text style={styles.collapsedText}>Add New Building</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.heading}>Add New Building</Text>
        <View style={styles.headerAccent}></View>
      </View>
      
      <View style={styles.inputGroup}>
        <User size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="Owner Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <User size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="President Name"
          value={presidentName}
          onChangeText={setPresidentName}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Building size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="Building Name"
          value={buildingName}
          onChangeText={setBuildingName}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Building size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="Building Number"
          value={buildingNumber}
          onChangeText={setBuildingNumber}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <MapPin size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Home size={18} color="#4361ee" style={styles.inputIcon} />
        <TextInput
          placeholder="Number of flats"
          value={flats}
          onChangeText={setFlats}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => setIsExpanded(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.addButton, 
            (!name || !address || !flats || !presidentName || !buildingName || !buildingNumber) && styles.disabledButton
          ]} 
          onPress={handleAdd}
          disabled={!name || !address || !flats || !presidentName || !buildingName || !buildingNumber}
        >
          <Text style={styles.addButtonText}>Add Building</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    backgroundColor: '#4361ee',
    padding: 16,
    position: 'relative',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerAccent: {
    height: 2,
    backgroundColor: '#3a86ff',
    marginTop: 12,
    width: '20%',
    alignSelf: 'center',
    borderRadius: 2
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#4361ee',
    padding: 16,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#c7d2fe',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    padding: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16
  },
  collapsedCard: {
    backgroundColor: '#4361ee',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  plusIcon: {
    marginRight: 8,
  },
  collapsedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default AddBuilding;
