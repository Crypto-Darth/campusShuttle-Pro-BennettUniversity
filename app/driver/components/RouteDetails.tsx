import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { driverStyles } from '../../../styles/driverStyles';

const RouteDetails = ({ route }) => {
  if (!route) return null;
  
  return (
    <ScrollView style={driverStyles.contentContainer}>
      <View style={driverStyles.routeContent}>
        <Text style={driverStyles.routeTitle}>{route.name || "Campus Route"}</Text>
        <Text style={driverStyles.routeDescription}>{route.description}</Text>

        {route.stops && route.stops.map((stop, index) => (
          <View key={index} style={driverStyles.stopItem}>
            <View style={driverStyles.stopMarkerSmall}>
              <Text style={driverStyles.stopNumber}>{index + 1}</Text>
            </View>
            <View style={driverStyles.stopDetails}>
              <Text style={driverStyles.stopName}>{stop.name}</Text>
              <Text style={driverStyles.stopAddress}>{stop.address}</Text>
              <Text style={driverStyles.stopTime}>{stop.scheduledTime}</Text>
            </View>
            <View style={driverStyles.stopStudents}>
              <Ionicons name="people" size={18} color="#4a80f5" />
              <Text style={driverStyles.studentCount}>{stop.students || 0}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RouteDetails;