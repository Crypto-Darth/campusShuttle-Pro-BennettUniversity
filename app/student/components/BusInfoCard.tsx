import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const BusInfoCard = ({ loading, busInfo, route, handleConfirmAttendance, isAttendanceConfirmed }) => {
  if (loading) {
    return <Text>Loading bus information...</Text>;
  }
  
  if (!busInfo) {
    return <Text>No bus information available at this time.</Text>;
  }
  
  return (
    <View style={studentStyles.sectionContainer}>
      <Text style={studentStyles.sectionTitle}>Campus Bus</Text>
      <View style={studentStyles.shuttleCard}>
        {/* Show attendance confirmed badge if present */}
        {isAttendanceConfirmed && (
          <View style={studentStyles.attendanceBadge}>
            <Ionicons name="checkmark-circle" size={12} color="white" />
            <Text style={studentStyles.attendanceBadgeText}>Attendance Confirmed</Text>
          </View>
        )}
        
        <View style={studentStyles.shuttleInfo}>
          <Text style={studentStyles.shuttleName}>{busInfo.name || "Campus Bus"}</Text>
          <Text style={studentStyles.shuttleRoute}>
            {route?.description || "Campus Route"}
          </Text>
        </View>
        <View style={studentStyles.shuttleEta}>
          <Text style={studentStyles.etaText}>
            ~ {busInfo.eta || "5 min"}
          </Text>
          <TouchableOpacity 
            style={[
              studentStyles.confirmButton,
              // Gray out if already confirmed
              isAttendanceConfirmed && { backgroundColor: '#ccc' }
            ]}
            onPress={handleConfirmAttendance}
            disabled={isAttendanceConfirmed}
          >
            <Text style={studentStyles.confirmButtonText}>
              {isAttendanceConfirmed ? 'Confirmed' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BusInfoCard;