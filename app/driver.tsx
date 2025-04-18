import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

// Conditionally import map components to avoid web errors
let MapView, Marker, Polyline, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  // Only import on native platforms
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  Polyline = MapComponents.Polyline;
  PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
}

export default function DriverPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('route');
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(0);
  
  useEffect(() => {
    // Check if running on native platform
    setIsNativePlatform(Platform.OS !== 'web');
  }, []);
  
  // Mock data for driver routes
  const routes = [
    { 
      id: 1, 
      name: 'Route A', 
      description: 'Main Campus → Dorms',
      stops: [
        { name: 'Main Campus', address: '123 University Ave', time: '7:30 AM', students: 8 },
        { name: 'Library', address: '456 Book St', time: '7:45 AM', students: 5 },
        { name: 'Dorms', address: '789 Residence Rd', time: '8:00 AM', students: 0 }
      ],
      coordinates: [
        { latitude: 37.78825, longitude: -122.4324 },
        { latitude: 37.78625, longitude: -122.4344 },
        { latitude: 37.78425, longitude: -122.4354 }
      ]
    },
    { 
      id: 2, 
      name: 'Route B', 
      description: 'Library → Sports Complex',
      stops: [
        { name: 'Library', address: '456 Book St', time: '8:00 AM', students: 4 },
        { name: 'Student Center', address: '555 Center Ave', time: '8:15 AM', students: 7 },
        { name: 'Sports Complex', address: '999 Athletic Dr', time: '8:30 AM', students: 2 }
      ],
      coordinates: [
        { latitude: 37.78625, longitude: -122.4344 },
        { latitude: 37.78525, longitude: -122.4304 },
        { latitude: 37.78325, longitude: -122.4264 }
      ]
    }
  ];

  // Mock data for students
  const students = [
    { id: 1, name: 'Emma Johnson', studentId: 'S12345', pickupLocation: 'Main Campus', confirmed: true },
    { id: 2, name: 'Noah Smith', studentId: 'S12346', pickupLocation: 'Main Campus', confirmed: true },
    { id: 3, name: 'Olivia Williams', studentId: 'S12347', pickupLocation: 'Main Campus', confirmed: false },
    { id: 4, name: 'Liam Brown', studentId: 'S12348', pickupLocation: 'Library', confirmed: true },
    { id: 5, name: 'Ava Jones', studentId: 'S12349', pickupLocation: 'Library', confirmed: true },
    { id: 6, name: 'Lucas Miller', studentId: 'S12350', pickupLocation: 'Student Center', confirmed: true },
    { id: 7, name: 'Sophia Davis', studentId: 'S12351', pickupLocation: 'Sports Complex', confirmed: false },
  ];

  // Driver's current location (simulated)
  const driverLocation = { latitude: 37.78825, longitude: -122.4324 };

  // Filter students by the selected route and stop
  const getStudentsByStop = (stopName) => {
    return students.filter(student => student.pickupLocation === stopName);
  };

  // Web-friendly map placeholder
  const WebMapPlaceholder = () => (
    <View style={styles.webMapPlaceholder}>
      <Text style={styles.mapPlaceholder}>Driver Route Map (Web Version)</Text>
      <View style={styles.webMapIconsContainer}>
        <View style={styles.webMapIcon}>
          <View style={styles.driverMarker}>
            <Ionicons name="bus" size={18} color="white" />
          </View>
          <Text style={styles.webMapIconLabel}>You</Text>
        </View>
        <View style={styles.webMapIcon}>
          <View style={styles.stopMarker}>
            <Ionicons name="location" size={18} color="white" />
          </View>
          <Text style={styles.webMapIconLabel}>Stop</Text>
        </View>
      </View>
      <Text style={styles.webMapNote}>
        Note: The interactive map is available on mobile devices.
      </Text>
    </View>
  );

  // Native map component
  const NativeMap = () => (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      {/* Driver marker */}
      <Marker
        coordinate={driverLocation}
        title="Your Location"
        description="You are here"
      >
        <View style={styles.driverMarker}>
          <Ionicons name="bus" size={18} color="white" />
        </View>
      </Marker>
      
      {/* Route stops markers */}
      {routes[selectedRoute].stops.map((stop, index) => {
        const coordinate = routes[selectedRoute].coordinates[index];
        return (
          <Marker
            key={index}
            coordinate={coordinate}
            title={stop.name}
            description={`${stop.time} - ${stop.students} students`}
          >
            <View style={styles.stopMarker}>
              <Ionicons name="location" size={18} color="white" />
              <Text style={styles.markerCount}>{stop.students}</Text>
            </View>
          </Marker>
        );
      })}
      
      {/* Route line */}
      <Polyline
        coordinates={routes[selectedRoute].coordinates}
        strokeWidth={4}
        strokeColor="#4a80f5"
      />
    </MapView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver View</Text>
        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => router.push('/')}
        >
          <Text style={styles.switchButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Route Selection */}
      <View style={styles.routeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routes.map((route, index) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeButton,
                selectedRoute === index && styles.selectedRouteButton
              ]}
              onPress={() => setSelectedRoute(index)}
            >
              <Text style={[
                styles.routeButtonText,
                selectedRoute === index && styles.selectedRouteButtonText
              ]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {isNativePlatform ? <NativeMap /> : <WebMapPlaceholder />}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'route' && styles.activeTab]} 
          onPress={() => setCurrentTab('route')}
        >
          <Ionicons 
            name="map" 
            size={24} 
            color={currentTab === 'route' ? '#4a80f5' : '#888'} 
          />
          <Text style={[styles.tabText, currentTab === 'route' && styles.activeTabText]}>
            Route
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentTab === 'students' && styles.activeTab]} 
          onPress={() => setCurrentTab('students')}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color={currentTab === 'students' ? '#4a80f5' : '#888'} 
          />
          <Text style={[styles.tabText, currentTab === 'students' && styles.activeTabText]}>
            Students
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected tab */}
      <ScrollView style={styles.contentContainer}>
        {currentTab === 'route' && (
          <View style={styles.routeContent}>
            <Text style={styles.routeTitle}>{routes[selectedRoute].name}</Text>
            <Text style={styles.routeDescription}>{routes[selectedRoute].description}</Text>

            {routes[selectedRoute].stops.map((stop, index) => (
              <View key={index} style={styles.stopItem}>
                <View style={styles.stopMarkerSmall}>
                  <Text style={styles.stopNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stopDetails}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopAddress}>{stop.address}</Text>
                  <Text style={styles.stopTime}>{stop.time}</Text>
                </View>
                <View style={styles.stopStudents}>
                  <Ionicons name="people" size={18} color="#4a80f5" />
                  <Text style={styles.studentCount}>{stop.students}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {currentTab === 'students' && (
          <View style={styles.studentsContent}>
            <Text style={styles.studentsTitle}>Confirmed Students</Text>
            <Text style={styles.studentsDescription}>Students who have confirmed their attendance</Text>

            {routes[selectedRoute].stops.map((stop, index) => {
              const stopStudents = getStudentsByStop(stop.name);
              const confirmedStudents = stopStudents.filter(student => student.confirmed);
              
              if (confirmedStudents.length === 0) return null;
              
              return (
                <View key={index} style={styles.stopStudentsSection}>
                  <View style={styles.stopHeaderRow}>
                    <Text style={styles.stopHeaderTitle}>{stop.name}</Text>
                    <Text style={styles.stopHeaderCount}>{confirmedStudents.length} students</Text>
                  </View>

                  {confirmedStudents.map(student => (
                    <View key={student.id} style={styles.studentCard}>
                      <View style={styles.studentAvatar}>
                        <Ionicons name="person" size={24} color="#fff" />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentId}>{student.studentId}</Text>
                      </View>
                      <Ionicons name="checkmark-circle" size={24} color="#34c759" />
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#34c759',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  switchButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  switchButtonText: {
    color: 'white',
    fontSize: 12,
  },
  routeSelector: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  routeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedRouteButton: {
    backgroundColor: '#34c759',
  },
  routeButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedRouteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8eaed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  webMapIconsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
    width: '60%',
  },
  webMapIcon: {
    alignItems: 'center',
  },
  webMapIconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  webMapNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  driverMarker: {
    backgroundColor: '#34c759',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopMarker: {
    backgroundColor: '#4a80f5',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4a80f5',
  },
  tabText: {
    marginLeft: 5,
    color: '#888',
  },
  activeTabText: {
    color: '#4a80f5',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  routeContent: {
    padding: 15,
  },
  routeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4a80f5',
  },
  stopMarkerSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stopNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  stopAddress: {
    fontSize: 14,
    color: '#666',
  },
  stopTime: {
    fontSize: 14,
    color: '#4a80f5',
    marginTop: 5,
    fontWeight: '500',
  },
  stopStudents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a80f5',
    marginLeft: 5,
  },
  studentsContent: {
    padding: 15,
  },
  studentsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studentsDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stopStudentsSection: {
    marginBottom: 20,
  },
  stopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  stopHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  stopHeaderCount: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
});