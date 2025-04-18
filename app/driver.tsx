import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { getRoute, updateBusLocation, subscribeToAttendance, getBusInfo, debugAttendanceData } from '../services/shuttleService';

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
  const [route, setRoute] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [driverId, setDriverId] = useState('driver1'); // This would come from authentication
  
  // Driver's current location (simulated)
  const driverLocation = { latitude: 37.78825, longitude: -122.4324 };

  useEffect(() => {
    // Check if running on native platform
    setIsNativePlatform(Platform.OS !== 'web');
    
    // Load route and bus info
    const loadData = async () => {
      try {
        // Load route data
        const routeData = await getRoute();
        setRoute(routeData);
        
        // Get bus info
        const bus = await getBusInfo();
        setBusInfo(bus);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up attendance subscription
    const unsubscribe = subscribeToAttendance((attendance) => {
      console.log(`Received attendance update: ${JSON.stringify(attendance)}`);
      setAttendanceList(attendance);
    });
    
    // Debug attendance data
    debugAttendanceData()
      .then(() => console.log("Attendance debug complete"))
      .catch(error => console.error("Error debugging attendance:", error));
    
    // Location update interval for the bus
    let locationInterval = null;
    
    if (isNativePlatform && busInfo?.id) {
      // In a real app, you would use the Geolocation API to get the actual location
      locationInterval = setInterval(() => {
        try {
          // Simulate movement by slightly adjusting coordinates
          const newLocation = {
            latitude: driverLocation.latitude + (Math.random() * 0.0001 - 0.00005),
            longitude: driverLocation.longitude + (Math.random() * 0.0001 - 0.00005)
          };
          
          // Update bus location in Firebase
          updateBusLocation(busInfo.id, newLocation);
        } catch (error) {
          console.error("Error updating location:", error);
        }
      }, 10000); // Update every 10 seconds
    }
    
    // Clean up subscriptions
    return () => {
      unsubscribe();
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [isNativePlatform, busInfo?.id]);
  
  // Native map component (update for single route)
  const NativeMap = () => {
    // Safety check - only render if route data is available
    if (!route) {
      return (
        <View style={[styles.map, {justifyContent: 'center', alignItems: 'center'}]}>
          <ActivityIndicator size="large" color="#34c759" />
          <Text style={{marginTop: 10}}>Loading map data...</Text>
        </View>
      );
    }
    
    return (
      <MapView
        style={styles.map}
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
          <View style={styles.driverMarker}>
            <Ionicons name="bus" size={18} color="white" />
          </View>
        </Marker>
        
        {/* Route stops markers */}
        {route.stops && route.stops.map((stop, index) => {
          return (
            <Marker
              key={index}
              coordinate={route.coordinates[index] || stop.location}
              title={stop.name}
              description={`${stop.scheduledTime} - ${stop.students} students`}
            >
              <View style={styles.stopMarker}>
                <Ionicons name="location" size={18} color="white" />
                <Text style={styles.markerCount}>{stop.students || 0}</Text>
              </View>
            </Marker>
          );
        })}
        
        {/* Route line */}
        <Polyline
          coordinates={route.coordinates || []}
          strokeWidth={4}
          strokeColor="#4a80f5"
        />
      </MapView>
    );
  };

  // If data is still loading, show a loading indicator
  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#34c759" />
        <Text style={{marginTop: 15, fontSize: 16}}>Loading route...</Text>
      </View>
    );
  }

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

      {/* Bus Info */}
      {busInfo && (
        <View style={styles.busInfo}>
          <Text style={styles.busTitle}>{busInfo.name || "Campus Bus"}</Text>
          <Text style={styles.busStatus}>Status: <Text style={{color: '#34c759'}}>{busInfo.status || "Active"}</Text></Text>
        </View>
      )}

      {/* Map View */}
      <View style={styles.mapContainer}>
        {isNativePlatform ? <NativeMap /> : (
          <View style={styles.webMapPlaceholder}>
            <Text style={styles.mapPlaceholder}>Driver Route Map (Web Version)</Text>
            <Text style={styles.webMapNote}>Note: The interactive map is available on mobile devices.</Text>
          </View>
        )}
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
        {currentTab === 'route' && route && (
          <View style={styles.routeContent}>
            <Text style={styles.routeTitle}>{route.name || "Campus Route"}</Text>
            <Text style={styles.routeDescription}>{route.description}</Text>

            {route.stops && route.stops.map((stop, index) => (
              <View key={index} style={styles.stopItem}>
                <View style={styles.stopMarkerSmall}>
                  <Text style={styles.stopNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stopDetails}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopAddress}>{stop.address}</Text>
                  <Text style={styles.stopTime}>{stop.scheduledTime}</Text>
                </View>
                <View style={styles.stopStudents}>
                  <Ionicons name="people" size={18} color="#4a80f5" />
                  <Text style={styles.studentCount}>{stop.students || 0}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {currentTab === 'students' && (
          <View style={styles.studentsContent}>
            <Text style={styles.studentsTitle}>Confirmed Students</Text>
            <Text style={styles.studentsDescription}>Students who have confirmed their attendance</Text>
            
            {/* Debug info - helpful for development */}
            <View style={{padding: 10, backgroundColor: '#f8f8f8', marginBottom: 10, borderRadius: 5}}>
              <Text style={{fontSize: 12, color: '#666'}}>Bus ID: {busInfo?.id || 'None'}</Text>
              <Text style={{fontSize: 12, color: '#666'}}>Students confirmed: {attendanceList.length}</Text>
            </View>
            
            {loading ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#34c759" />
                <Text style={{marginTop: 10}}>Loading confirmed students...</Text>
              </View>
            ) : !busInfo ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={styles.noDataText}>No bus information available</Text>
              </View>
            ) : attendanceList.length === 0 ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Ionicons name="people-outline" size={48} color="#ccc" />
                <Text style={styles.noDataText}>No students have confirmed attendance yet</Text>
                <Text style={{fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8}}>
                  When students confirm attendance, they'll appear here
                </Text>
              </View>
            ) : (
              // Group by pickup location
              Object.entries(
                attendanceList.reduce((grouped, attendance) => {
                  // Make sure to handle undefined pickupLocation
                  const location = attendance.pickupLocation || 'Unknown Location';
                  if (!grouped[location]) grouped[location] = [];
                  grouped[location].push(attendance);
                  return grouped;
                }, {})
              ).map(([location, students]) => (
                <View key={location} style={styles.stopStudentsSection}>
                  <View style={styles.stopHeaderRow}>
                    <Text style={styles.stopHeaderTitle}>{location}</Text>
                    <Text style={styles.stopHeaderCount}>{students.length} students</Text>
                  </View>
                  
                  {students.map(student => (
                    <View key={student.id} style={styles.studentCard}>
                      <View style={styles.studentAvatar}>
                        <Ionicons name="person" size={24} color="#fff" />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>
                          {student.displayName || `Student #${student.studentId}`}
                        </Text>
                        <Text style={styles.studentConfirmed}>
                          {student.timestamp ? 
                            `Confirmed at ${student.displayTime || new Date(student.timestamp.toDate()).toLocaleTimeString()}` : 
                            'Recently confirmed'}
                        </Text>
                      </View>
                      <Ionicons name="checkmark-circle" size={24} color="#34c759" />
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Extend the styles to include busInfo
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
  studentConfirmed: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  shuttleSelector: {
    backgroundColor: '#f0f4f8',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  shuttleSelectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  shuttleSelectorButtons: {
    flexDirection: 'row',
  },
  shuttleSelectorButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedShuttleButton: {
    backgroundColor: '#34c759',
  },
  shuttleSelectorButtonText: {
    color: '#333',
    fontSize: 12,
  },
  selectedShuttleButtonText: {
    color: 'white',
  },
  busInfo: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  busTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  busStatus: {
    fontSize: 14,
    color: '#666',
  },
});