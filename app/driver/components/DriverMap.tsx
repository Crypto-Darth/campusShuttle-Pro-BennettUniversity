import React from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { driverStyles } from '../../../styles/driverStyles';
import { commonStyles } from '../../../styles/commonStyles';

// Conditionally import map components to avoid web errors
let MapView, Marker, Polyline;
if (Platform.OS !== 'web') {
  // Only import on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  Polyline = MapComponents.Polyline;
}

// Web version of map (for browsers)
const WebMapPlaceholder = () => (
  <View style={commonStyles.webMapPlaceholder}>
    <Text style={commonStyles.mapPlaceholder}>Driver Route Map (Web Version)</Text>
    <Text style={commonStyles.webMapNote}>Note: The interactive map is available on mobile devices.</Text>
  </View>
);

// Native version of map (for mobile)
const NativeMapView = ({ route, driverLocation }) => {
  // Safety check - only render if route data is available
  if (!route) {
    return (
      <View style={[commonStyles.map, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#34c759" />
        <Text style={{marginTop: 10}}>Loading map data...</Text>
      </View>
    );
  }
  
  return (
    <MapView
      style={commonStyles.map}
      initialRegion={{
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      {/* Driver/Bus marker */}
      <Marker
        coordinate={driverLocation}
        title="Your Location"
        description="You are here"
      >
        <View style={driverStyles.driverMarker}>
          <Ionicons name="bus" size={18} color="white" />
        </View>
      </Marker>
      
      {/* Route stops markers */}
      {route.stops && route.stops.map((stop, index) => (
        <Marker
          key={index}
          coordinate={route.coordinates?.[index] || stop.location}
          title={stop.name}
          description={`${stop.scheduledTime} - ${stop.students || 0} students`}
        >
          <View style={driverStyles.stopMarker}>
            <Ionicons name="location" size={18} color="white" />
            <Text style={driverStyles.markerCount}>{stop.students || 0}</Text>
          </View>
        </Marker>
      ))}
      
      {/* Route line */}
      {route.coordinates && route.coordinates.length > 0 && (
        <Polyline
          coordinates={route.coordinates}
          strokeWidth={4}
          strokeColor="#4a80f5"
        />
      )}
    </MapView>
  );
};

const DriverMap = ({ isNativePlatform, route, driverLocation }) => {
  return (
    <View style={driverStyles.mapContainer}>
      {isNativePlatform ? 
        <NativeMapView route={route} driverLocation={driverLocation} /> : 
        <WebMapPlaceholder />
      }
    </View>
  );
};

export default DriverMap;