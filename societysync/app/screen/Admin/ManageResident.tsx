import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { User, Home, Phone, Mail, Trash, X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

const ManageResident = ({ route, navigation }: any) => {
  const { building, selectedBlock, resident, onSave, onDelete } = route.params;

  // Set initial state from existing resident if editing
  const [residentName, setResidentName] = useState(resident ? resident.name : '');
  const [flatNumber, setFlatNumber] = useState(resident ? resident.flat : '');
  const [block, setBlock] = useState(resident ? resident.block : selectedBlock || '');
  const [phone, setPhone] = useState(resident ? resident.phone || '' : '');
  const [email, setEmail] = useState(resident ? resident.email || '' : '');
  const [isCommitteeMember, setIsCommitteeMember] = useState(resident ? resident.isCommitteeMember : false);

  const isEditMode = !!resident;

  const validateForm = () => {
    if (!residentName.trim()) {
      Alert.alert('Error', 'Please enter resident name');
      return false;
    }
    if (!flatNumber.trim()) {
      Alert.alert('Error', 'Please enter flat number');
      return false;
    }
    if (!block) {
      Alert.alert('Error', 'Please select a block');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    return true;
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this resident?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (onDelete && resident) {
              onDelete(resident.id);
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Create new resident object
    const newResident = {
      id: resident ? resident.id : Date.now().toString(),  // Consider using a better unique ID generator
      name: residentName,
      flat: flatNumber,
      block,
      phone, // Phone is now mandatory
      email, // Email is now mandatory
      isCommitteeMember
    };

    // Call the provided onSave function
    if (onSave) {
      onSave(newResident);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditMode ? 'Edit Resident' : 'Add New Resident'}
        </Text>
        <Text style={styles.subtitle}>{building.name}</Text>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <User size={20} color="#4361ee" style={styles.inputIcon} />
          <TextInput
            value={residentName}
            onChangeText={setResidentName}
            placeholder="Resident Name *"
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Home size={20} color="#4361ee" style={styles.inputIcon} />
          <TextInput
            value={flatNumber}
            onChangeText={setFlatNumber}
            placeholder="Flat Number (e.g. A-101) *"
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select Block *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={block}
              onValueChange={(itemValue) => setBlock(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a block" value="" color="#9ca3af" />
              {building.blocks.map((b:any) => (
                <Picker.Item 
                  key={b.name} 
                  label={`Block ${b.name}`} 
                  value={b.name} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Phone size={20} color="#4361ee" style={styles.inputIcon} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number *"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Mail size={20} color="#4361ee" style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address *"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.switchLabel}>President</Text>
            <Text style={styles.switchDescription}>
              Designate this resident as a President
            </Text>
          </View>
          <Switch
            value={isCommitteeMember}
            onValueChange={setIsCommitteeMember}
            trackColor={{ false: '#eee', true: '#c7d2fe' }}
            thumbColor={isCommitteeMember ? '#4361ee' : '#f4f3f4'}
            ios_backgroundColor="#eee"
          />
        </View>

        {isEditMode && (
          <TouchableOpacity 
            onPress={handleDelete} 
            style={styles.deleteButton}
          >
            <Trash size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.deleteButtonText}>Delete Resident</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.cancelButton}
        >
          <X size={20} color="#6b7280" style={styles.buttonIcon} />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.saveButton, (!residentName || !flatNumber || !block || !phone || !email) && styles.disabledButton]}
          disabled={!residentName || !flatNumber || !block || !phone || !email}
        >
          <Text style={styles.saveButtonText}>
            {isEditMode ? 'Save Changes' : 'Add Resident'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4361ee',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4361ee',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af', // Grayed out when disabled
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ManageResident;