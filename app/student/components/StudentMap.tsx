import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Conditionally import map components to avoid web errors
let MapView, Marker, Polyline, UrlTile;
if (Platform.OS !== 'web') {
  // Only import on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  Polyline = MapComponents.Polyline;
  UrlTile = MapComponents.UrlTile;
}

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

// Native map component for mobile devices with OpenStreetMap
const NativeMapView = ({ userLocation, bennettLocation, busInfo }) => {
  return (
    <MapView
      style={studentStyles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      mapType="none"
    >
      {/* OpenStreetMap Tiles */}
      <UrlTile
        urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        zIndex={-1}
      />
      
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
      
      {/* Route from user to college - simple straight line */}
      <Polyline
        coordinates={[userLocation, bennettLocation]}
        strokeWidth={3}
        strokeColor="#4a80f5"
        lineDashPattern={[5, 5]}
      />
      
      {/* Route from bus to college - if bus info is available */}
      {busInfo && busInfo.location && (
        <Polyline
          coordinates={[busInfo.location, bennettLocation]}
          strokeWidth={4}
          strokeColor="#ff9500"
        />
      )}
    </MapView>
  );
};

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