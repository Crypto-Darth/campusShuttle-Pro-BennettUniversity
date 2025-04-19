import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const students = [
  {
    id: 'E22CSEU0001',
    name: 'Aditya Banerjee',
    pickupLocation: 'Alpha 1',
  },
  {
    id: 'E22CSEU0002',
    name: 'Kshitiz Yadav',
    pickupLocation: 'Pari Chowk',
  },
  {
    id: 'E22CSEU0003',
    name: 'Sneyank Das',
    pickupLocation: 'Gamma I',
  },
  {
    id: 'E22CSEU0004',
    name: 'Samir Chowdhary',
    pickupLocation: 'Beta 1',
  },
];

const StudentSwitcher = ({ 
  currentStudentId, 
  onStudentChange, 
  visible, 
  setVisible 
}) => {
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
            <Text style={studentStyles.modalTitle}>Switch Student</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={studentStyles.modalBody}>
            <Text style={studentStyles.modalLabel}>Select a student to test:</Text>
            
            <FlatList
              data={students}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    studentStyles.studentSwitcherItem,
                    item.id === currentStudentId && studentStyles.studentSwitcherItemActive
                  ]} 
                  onPress={() => {
                    onStudentChange(item.id, item.name);
                    setVisible(false);
                  }}
                >
                  <View style={studentStyles.studentSwitcherAvatar}>
                    <Text style={studentStyles.studentSwitcherInitial}>
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={studentStyles.studentSwitcherInfo}>
                    <Text style={[
                      studentStyles.studentSwitcherName,
                      item.id === currentStudentId && studentStyles.studentSwitcherNameActive
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={studentStyles.studentSwitcherId}>
                      ID: {item.id}
                    </Text>
                    <Text style={studentStyles.studentSwitcherLocation}>
                      Pickup: {item.pickupLocation}
                    </Text>
                  </View>
                  {item.id === currentStudentId && (
                    <View style={studentStyles.studentSwitcherCheck}>
                      <Ionicons name="checkmark-circle" size={24} color="#4a80f5" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={studentStyles.studentSwitcherSeparator} />}
            />

            <Text style={studentStyles.alertNote}>
              Testing mode: Switch between students to test multiple attendance confirmations.
            </Text>
          </View>
          
          <View style={studentStyles.modalFooter}>
            <TouchableOpacity 
              style={studentStyles.cancelButton} 
              onPress={() => setVisible(false)}
            >
              <Text style={studentStyles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StudentSwitcher;