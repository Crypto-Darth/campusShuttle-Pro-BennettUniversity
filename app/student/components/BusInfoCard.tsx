import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { studentStyles } from '../../../styles/studentStyles';

const BusInfoCard = ({ loading, busInfo, route, handleConfirmAttendance }) => {
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
            style={studentStyles.confirmButton}
            onPress={handleConfirmAttendance}
          >
            <Text style={studentStyles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BusInfoCard;