import React from 'react';
import { View, Text } from 'react-native';
import { studentStyles } from '../../../styles/studentStyles';

const ScheduleView = ({ busInfo, route }) => {
  if (!route) return null;
  
  return (
    <View style={studentStyles.sectionContainer}>
      <Text style={studentStyles.sectionTitle}>Bus Schedule</Text>
      <Text style={studentStyles.infoText}>View today's bus timings</Text>
      
      <View style={studentStyles.scheduleCard}>
        <Text style={studentStyles.scheduleCardTitle}>{busInfo?.name || "Campus Bus"}</Text>
        <Text style={studentStyles.scheduleCardRoute}>{route.description}</Text>
        
        {/* Schedule stops */}
        {route.stops && route.stops.map((stop, index) => (
          <View key={index} style={studentStyles.scheduleStop}>
            <Text style={studentStyles.scheduleTime}>{stop.scheduledTime}</Text>
            <Text style={studentStyles.scheduleLocation}>{stop.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ScheduleView;