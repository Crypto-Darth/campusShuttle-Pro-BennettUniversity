import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const SOSModal = ({ visible, setVisible }) => {
  const [sosMessage, setSosMessage] = useState('');
  const [sosLocation, setSosLocation] = useState('Share my current location');
  
  // Send SOS alert
  const sendSOS = () => {
    alert(`SOS Alert Sent! Help is on the way.${sosMessage ? `\n\nMessage: ${sosMessage}` : ''}\n\nLocation: ${sosLocation === 'Share my current location' ? 'Current GPS location shared' : sosLocation}`);
    setVisible(false);
    setSosMessage('');
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={studentStyles.modalOverlay}>
        <View style={studentStyles.modalContent}>
          <View style={studentStyles.modalHeader}>
            <Text style={studentStyles.modalTitle}>SOS Emergency Alert</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={studentStyles.modalBody}>
            <Text style={studentStyles.modalLabel}>Message (Optional):</Text>
            <TextInput
              style={studentStyles.modalInput}
              value={sosMessage}
              onChangeText={setSosMessage}
              placeholder="Describe your emergency situation"
              multiline={true}
              numberOfLines={3}
            />
            
            <Text style={studentStyles.modalLabel}>Location:</Text>
            <TouchableOpacity style={studentStyles.locationSelector}>
              <Text style={studentStyles.locationText}>{sosLocation}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            
            <Text style={studentStyles.alertNote}>
              Your alert will be sent to campus security and bus drivers in your area
            </Text>
          </View>
          
          <View style={studentStyles.modalFooter}>
            <TouchableOpacity 
              style={studentStyles.cancelButton} 
              onPress={() => setVisible(false)}
            >
              <Text style={studentStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={studentStyles.sosModalButton} 
              onPress={sendSOS}
            >
              <Text style={studentStyles.sosModalButtonText}>Send Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SOSModal;