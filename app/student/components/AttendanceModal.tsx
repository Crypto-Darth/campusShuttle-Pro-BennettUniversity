import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';
import { confirmAttendance } from '../../../services/busService';

const AttendanceModal = ({ visible, setVisible, busInfo, route, studentId, studentName }) => {
  // Complete attendance confirmation
  const completeAttendanceConfirmation = async () => {
    try {
      // Get the pickup location from route data
      let pickupLocation = "Main Campus"; // Default fallback location
      
      if (route && route.stops && route.stops.length > 0) {
        pickupLocation = route.stops[0].name;
      }
      
      console.log(`Sending attendance confirmation - Student: ${studentId}, Location: ${pickupLocation}`);
      
      // Save attendance record to Firebase with student name
      await confirmAttendance(studentId, pickupLocation, studentName);
      
      alert(`Attendance confirmed for ${busInfo?.name || 'Campus Bus'}. The driver has been notified.`);
      setVisible(false);
    } catch (error) {
      console.error("Error confirming attendance:", error);
      alert("There was an error confirming your attendance. Please try again.");
    }
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
            <Text style={studentStyles.modalTitle}>Confirm Attendance</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {busInfo && (
            <View style={studentStyles.modalBody}>
              <View style={studentStyles.attendanceInfo}>
                <View style={studentStyles.shuttleIconLarge}>
                  <Ionicons name="bus" size={32} color="#fff" />
                </View>
                <View style={studentStyles.attendanceDetails}>
                  <Text style={studentStyles.attendanceShuttleName}>{busInfo.name || "Campus Bus"}</Text>
                  <Text style={studentStyles.attendanceRoute}>{route?.description || "Campus Route"}</Text>
                  <Text style={studentStyles.attendanceEta}>ETA: {busInfo.eta || "5 min"}</Text>
                </View>
              </View>
              
              <Text style={studentStyles.attendanceNote}>
                By confirming your attendance, you're letting the driver know you'll be boarding the bus.
              </Text>
            </View>
          )}
          
          <View style={studentStyles.modalFooter}>
            <TouchableOpacity 
              style={studentStyles.cancelButton} 
              onPress={() => setVisible(false)}
            >
              <Text style={studentStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={studentStyles.confirmModalButton} 
              onPress={completeAttendanceConfirmation}
            >
              <Text style={studentStyles.confirmModalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AttendanceModal;