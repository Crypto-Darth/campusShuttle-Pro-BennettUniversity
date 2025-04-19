import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const TrackingView = ({ busInfo, route }) => {
  if (!busInfo) return null;
  
  return (
    <View style={studentStyles.sectionContainer}>
      <Text style={studentStyles.sectionTitle}>Bus Tracking</Text>
      <Text style={studentStyles.infoText}>Track the campus bus location in real-time</Text>
      
      <View style={studentStyles.trackingCard}>
        <View style={studentStyles.trackingCardHeader}>
          <View style={studentStyles.shuttleIconContainer}>
            <View style={studentStyles.shuttleMarker}>
              <Ionicons name="bus" size={18} color="white" />
            </View>
          </View>
          <Text style={studentStyles.trackingCardTitle}>{busInfo.name || "Campus Bus"}</Text>
          <Text style={studentStyles.trackingCardEta}>{busInfo.eta || "5 min"}</Text>
        </View>
        <View style={studentStyles.trackingCardDetails}>
          <Text style={studentStyles.trackingCardRoute}>{route?.description || "Campus Route"}</Text>
          <View style={studentStyles.trackingMetrics}>
            <View style={studentStyles.metricItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={studentStyles.metricText}>12 Students</Text>
            </View>
            <View style={studentStyles.metricItem}>
              <Ionicons name="speedometer-outline" size={16} color="#666" />
              <Text style={studentStyles.metricText}>15 mph</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackingView;