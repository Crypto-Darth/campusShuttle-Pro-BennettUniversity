import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

// Conditionally import map components to avoid web errors
let MapView, Marker, MapViewDirections, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  // Only import on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
  MapViewDirections = require('react-native-maps-directions').default;
}

// API key for Google Maps directions
const GOOGLE_MAPS_APIKEY = 'AIzaSyB2wxa1MLXzINy1cneQ7mWbeLr6It1WY0o';

// Web version of map (for browsers)
const WebMapPlaceholder = () => (
  <View style={studentStyles.webMapPlaceholder}>
    <Text style={studentStyles.mapPlaceholder}>Interactive Map (Web Version)</Text>
    <View style={studentStyles.webMapIconsContainer}>
      <View style={studentStyles.webMapIcon}>
        <View style={studentStyles.userMarker}>
          <Ionicons name="person" size={18} color="white" />
        </View>
        <Text style={studentStyles.webMapIconLabel}>You</Text>
      </View>
      <View style={studentStyles.webMapIcon}>
        <View style={studentStyles.collegeMarker}>
          <Ionicons name="school" size={18} color="white" />
        </View>
        <Text style={studentStyles.webMapIconLabel}>College</Text>
      </View>
      <View style={studentStyles.webMapIcon}>
        <View style={studentStyles.shuttleMarker}>
          <Ionicons name="bus" size={18} color="white" />
        </View>
        <Text style={studentStyles.webMapIconLabel}>Bus</Text>
      </View>
    </View>
    <Text style={studentStyles.webMapNote}>
      Note: The interactive map is available on mobile devices.
    </Text>
  </View>
);

// Native map component for mobile devices
const NativeMapView = ({ userLocation, bennettLocation, busInfo }) => (
  <MapView
    style={studentStyles.map}
    initialRegion={{
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }}
  >
    {/* User marker */}
    <Marker
      coordinate={userLocation}
      title="You are here"
      description="Your current location"
    >
      <View style={studentStyles.userMarker}>
        <Ionicons name="person" size={18} color="white" />
      </View>
    </Marker>
    
    {/* College marker */}
    <Marker
      coordinate={bennettLocation}
      title="Bennett University"
      description="Your destination"
    >
      <View style={studentStyles.collegeMarker}>
        <Ionicons name="school" size={18} color="white" />
      </View>
    </Marker>
    
    {/* Bus marker - if we have bus info */}
    {busInfo && busInfo.location && (
      <Marker
        coordinate={busInfo.location}
        title={busInfo.name || "Campus Bus"}
        description={`ETA: ${busInfo.eta || "5 min"}`}
      >
        <View style={studentStyles.shuttleMarker}>
          <Ionicons name="bus" size={18} color="white" />
        </View>
      </Marker>
    )}
    
    {/* Route from user to college */}
    <MapViewDirections
      origin={userLocation}
      destination={bennettLocation}
      apikey={GOOGLE_MAPS_APIKEY}
      strokeWidth={3}
      strokeColor="#4a80f5"
      mode="WALKING"
    />
    
    {/* Route from bus to college */}
    {busInfo && busInfo.location && (
      <MapViewDirections
        origin={busInfo.location}
        destination={bennettLocation}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={4}
        strokeColor="#ff9500"
        mode="DRIVING"
      />
    )}
  </MapView>
);

const StudentMap = ({ isNativePlatform, userLocation, bennettLocation, busInfo, handleSOS }) => {
  return (
    <View style={studentStyles.mapContainer}>
      {isNativePlatform ? (
        <NativeMapView 
          userLocation={userLocation} 
          bennettLocation={bennettLocation} 
          busInfo={busInfo} 
        />
      ) : (
        <WebMapPlaceholder />
      )}
      
      <View style={studentStyles.mapOverlay}>
        <TouchableOpacity style={studentStyles.sosButton} onPress={handleSOS}>
          <Text style={studentStyles.sosButtonText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentMap;