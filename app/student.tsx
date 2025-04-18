import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, Switch, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { getBusInfo, confirmAttendance, subscribeToBusLocation, getRoute } from '../services/shuttleService';

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

export default function StudentPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('home');
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [sosLocation, setSosLocation] = useState('Share my current location');
  const [showAttendanceConfirmation, setShowAttendanceConfirmation] = useState(false);
  const [studentId, setStudentId] = useState('STU12345'); // This would come from authentication
  const [busInfo, setBusInfo] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if running on native platform
    setIsNativePlatform(Platform.OS !== 'web');
    
    // Load bus information and set up real-time listener
    const unsubscribe = subscribeToBusLocation((bus) => {
      setBusInfo(bus);
      setLoading(false);
    });
    
    // Load route information
    getRoute().then(routeData => {
      setRoute(routeData);
    }).catch(error => {
      console.error("Error loading route data:", error);
    });
    
    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);
  
  // User's current location (simulated)
  const userLocation = { latitude: 37.7875, longitude: -122.4324 };
  
  // College location (destination)
  const collegeLocation = { latitude: 37.7835, longitude: -122.4284 };

  // Web-friendly map placeholder
  const WebMapPlaceholder = () => (
    <View style={styles.webMapPlaceholder}>
      <Text style={styles.mapPlaceholder}>Interactive Map (Web Version)</Text>
      <View style={styles.webMapIconsContainer}>
        <View style={styles.webMapIcon}>
          <View style={styles.userMarker}>
            <Ionicons name="person" size={18} color="white" />
          </View>
          <Text style={styles.webMapIconLabel}>You</Text>
        </View>
        <View style={styles.webMapIcon}>
          <View style={styles.collegeMarker}>
            <Ionicons name="school" size={18} color="white" />
          </View>
          <Text style={styles.webMapIconLabel}>College</Text>
        </View>
        <View style={styles.webMapIcon}>
          <View style={styles.shuttleMarker}>
            <Ionicons name="bus" size={18} color="white" />
          </View>
          <Text style={styles.webMapIconLabel}>Shuttle</Text>
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
        <View style={styles.userMarker}>
          <Ionicons name="person" size={18} color="white" />
        </View>
      </Marker>
      
      {/* College marker */}
      <Marker
        coordinate={collegeLocation}
        title="College"
        description="Your destination"
      >
        <View style={styles.collegeMarker}>
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
          <View style={styles.shuttleMarker}>
            <Ionicons name="bus" size={18} color="white" />
          </View>
        </Marker>
      )}
      
      {/* Route from user to college */}
      <MapViewDirections
        origin={userLocation}
        destination={collegeLocation}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="#4a80f5"
        mode="WALKING"
      />
      
      {/* Route from bus to college */}
      {busInfo && busInfo.location && (
        <MapViewDirections
          origin={busInfo.location}
          destination={collegeLocation}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#ff9500"
          mode="DRIVING"
        />
      )}
    </MapView>
  );

  // Handle SOS alert
  const handleSOS = () => {
    setSosModalVisible(true);
  };

  // Send SOS alert
  const sendSOS = () => {
    alert(`SOS Alert Sent! Help is on the way.${sosMessage ? `\n\nMessage: ${sosMessage}` : ''}\n\nLocation: ${sosLocation === 'Share my current location' ? 'Current GPS location shared' : sosLocation}`);
    setSosModalVisible(false);
    setSosMessage('');
  };

  // Handle attendance confirmation
  const handleConfirmAttendance = () => {
    setShowAttendanceConfirmation(true);
  };

  // Complete attendance confirmation
  const completeAttendanceConfirmation = async () => {
    try {
      // Get the pickup location from route data
      let pickupLocation = "Main Campus"; // Default fallback location
      
      if (route && route.stops && route.stops.length > 0) {
        pickupLocation = route.stops[0].name;
      }
      
      console.log(`Sending attendance confirmation - Student: ${studentId}, Location: ${pickupLocation}`);
      
      // Save attendance record to Firebase
      await confirmAttendance(studentId, pickupLocation);
      
      alert(`Attendance confirmed for ${busInfo?.name || 'Campus Bus'}. The driver has been notified.`);
      setShowAttendanceConfirmation(false);
    } catch (error) {
      console.error("Error confirming attendance:", error);
      alert("There was an error confirming your attendance. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student View</Text>
        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => router.push('/')}
        >
          <Text style={styles.switchButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.contentContainer}>
        {currentTab === 'home' && (
          <>
            {/* Map View */}
            <View style={styles.mapContainer}>
              {isNativePlatform ? <NativeMap /> : <WebMapPlaceholder />}
              
              <View style={styles.mapOverlay}>
                <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
                  <Text style={styles.sosButtonText}>SOS</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Campus Bus Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Campus Bus</Text>
              {loading ? (
                <Text>Loading bus information...</Text>
              ) : !busInfo ? (
                <Text>No bus information available at this time.</Text>
              ) : (
                <View style={styles.shuttleCard}>
                  <View style={styles.shuttleInfo}>
                    <Text style={styles.shuttleName}>{busInfo.name || "Campus Bus"}</Text>
                    <Text style={styles.shuttleRoute}>
                      {route?.description || "Campus Route"}
                    </Text>
                  </View>
                  <View style={styles.shuttleEta}>
                    <Text style={styles.etaText}>
                      ~ {busInfo.eta || "5 min"}
                    </Text>
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={handleConfirmAttendance}
                    >
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setCurrentTab('schedule')}>
                  <Ionicons name="calendar-outline" size={24} color="#4a80f5" />
                  <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setCurrentTab('tracking')}>
                  <Ionicons name="location-outline" size={24} color="#4a80f5" />
                  <Text style={styles.actionText}>Track</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setCurrentTab('profile')}>
                  <Ionicons name="settings-outline" size={24} color="#4a80f5" />
                  <Text style={styles.actionText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        
        {currentTab === 'tracking' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bus Tracking</Text>
            <Text style={styles.infoText}>Track the campus bus location in real-time</Text>
            
            {/* Bus tracking view */}
            {busInfo && (
              <View style={styles.trackingCard}>
                <View style={styles.trackingCardHeader}>
                  <View style={styles.shuttleIconContainer}>
                    <View style={styles.shuttleMarker}>
                      <Ionicons name="bus" size={18} color="white" />
                    </View>
                  </View>
                  <Text style={styles.trackingCardTitle}>{busInfo.name || "Campus Bus"}</Text>
                  <Text style={styles.trackingCardEta}>{busInfo.eta || "5 min"}</Text>
                </View>
                <View style={styles.trackingCardDetails}>
                  <Text style={styles.trackingCardRoute}>{route?.description || "Campus Route"}</Text>
                  <View style={styles.trackingMetrics}>
                    <View style={styles.metricItem}>
                      <Ionicons name="people-outline" size={16} color="#666" />
                      <Text style={styles.metricText}>12 Students</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="speedometer-outline" size={16} color="#666" />
                      <Text style={styles.metricText}>15 mph</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        
        {currentTab === 'schedule' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bus Schedule</Text>
            <Text style={styles.infoText}>View today's bus timings</Text>
            
            {/* Bus schedule */}
            {route && (
              <View style={styles.scheduleCard}>
                <Text style={styles.scheduleCardTitle}>{busInfo?.name || "Campus Bus"}</Text>
                <Text style={styles.scheduleCardRoute}>{route.description}</Text>
                
                {/* Schedule stops */}
                {route.stops && route.stops.map((stop, index) => (
                  <View key={index} style={styles.scheduleStop}>
                    <Text style={styles.scheduleTime}>{stop.scheduledTime}</Text>
                    <Text style={styles.scheduleLocation}>{stop.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {currentTab === 'profile' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>My Profile</Text>
            
            <View style={styles.profileSection}>
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Student Name</Text>
                  <Text style={styles.profileId}>ID: STU12345</Text>
                </View>
              </View>
              
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>Preferences</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                    <Text style={styles.settingLabel}>Notifications</Text>
                  </View>
                  <Switch 
                    value={true} 
                    onValueChange={() => {}} 
                    trackColor={{ false: "#ccc", true: "#4a80f5" }}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons name="location-outline" size={24} color="#333" />
                    <Text style={styles.settingLabel}>Location Sharing</Text>
                  </View>
                  <Switch 
                    value={true} 
                    onValueChange={() => {}} 
                    trackColor={{ false: "#ccc", true: "#4a80f5" }}
                  />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons name="alert-circle-outline" size={24} color="#333" />
                    <Text style={styles.settingLabel}>Emergency Contacts</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLabelContainer}>
                    <Ionicons name="log-out-outline" size={24} color="#333" />
                    <Text style={styles.settingLabel}>Logout</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'home' && styles.activeNavItem]} 
          onPress={() => setCurrentTab('home')}
        >
          <Ionicons name="home" size={24} color={currentTab === 'home' ? '#4a80f5' : '#888'} />
          <Text style={[styles.navText, currentTab === 'home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'tracking' && styles.activeNavItem]} 
          onPress={() => setCurrentTab('tracking')}
        >
          <Ionicons name="location" size={24} color={currentTab === 'tracking' ? '#4a80f5' : '#888'} />
          <Text style={[styles.navText, currentTab === 'tracking' && styles.activeNavText]}>Track</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'schedule' && styles.activeNavItem]} 
          onPress={() => setCurrentTab('schedule')}
        >
          <Ionicons name="calendar" size={24} color={currentTab === 'schedule' ? '#4a80f5' : '#888'} />
          <Text style={[styles.navText, currentTab === 'schedule' && styles.activeNavText]}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'profile' && styles.activeNavItem]} 
          onPress={() => setCurrentTab('profile')}
        >
          <Ionicons name="person" size={24} color={currentTab === 'profile' ? '#4a80f5' : '#888'} />
          <Text style={[styles.navText, currentTab === 'profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sosModalVisible}
        onRequestClose={() => setSosModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SOS Emergency Alert</Text>
              <TouchableOpacity onPress={() => setSosModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Message (Optional):</Text>
              <TextInput
                style={styles.modalInput}
                value={sosMessage}
                onChangeText={setSosMessage}
                placeholder="Describe your emergency situation"
                multiline={true}
                numberOfLines={3}
              />
              
              <Text style={styles.modalLabel}>Location:</Text>
              <TouchableOpacity style={styles.locationSelector}>
                <Text style={styles.locationText}>{sosLocation}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              
              <Text style={styles.alertNote}>
                Your alert will be sent to campus security and shuttle drivers in your area
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setSosModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sosModalButton} 
                onPress={sendSOS}
              >
                <Text style={styles.sosModalButtonText}>Send Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Attendance Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAttendanceConfirmation}
        onRequestClose={() => setShowAttendanceConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Attendance</Text>
              <TouchableOpacity onPress={() => setShowAttendanceConfirmation(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {busInfo && (
              <View style={styles.modalBody}>
                <View style={styles.attendanceInfo}>
                  <View style={styles.shuttleIconLarge}>
                    <Ionicons name="bus" size={32} color="#fff" />
                  </View>
                  <View style={styles.attendanceDetails}>
                    <Text style={styles.attendanceShuttleName}>{busInfo.name || "Campus Bus"}</Text>
                    <Text style={styles.attendanceRoute}>{route?.description || "Campus Route"}</Text>
                    <Text style={styles.attendanceEta}>ETA: {busInfo.eta || "5 min"}</Text>
                  </View>
                </View>
                
                <Text style={styles.attendanceNote}>
                  By confirming your attendance, you're letting the driver know you'll be boarding the bus.
                </Text>
              </View>
            )}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAttendanceConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmModalButton} 
                onPress={completeAttendanceConfirmation}
              >
                <Text style={styles.confirmModalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#4a80f5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  webMapPlaceholder: {
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: '#e8eaed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapIconsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
    width: '80%',
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
  mapPlaceholder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  sosButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sosButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userMarker: {
    backgroundColor: '#4a80f5',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  shuttleMarker: {
    backgroundColor: '#ff9500',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  collegeMarker: {
    backgroundColor: '#34c759',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  sectionContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  shuttleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shuttleInfo: {
    flex: 3,
  },
  shuttleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  shuttleRoute: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  shuttleEta: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  etaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  confirmButton: {
    backgroundColor: '#4a80f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: '#4a80f5',
    paddingTop: 2,
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4a80f5',
  },
  centeredContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  trackingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shuttleIconContainer: {
    marginRight: 10,
  },
  trackingCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  trackingCardEta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  trackingCardDetails: {
    marginTop: 10,
  },
  trackingCardRoute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trackingMetrics: {
    flexDirection: 'row',
    marginTop: 5,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metricText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  scheduleTabs: {
    marginTop: 10,
  },
  scheduleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  scheduleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleCardRoute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  scheduleStop: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: '#4a80f5',
    paddingLeft: 15,
    paddingVertical: 8,
  },
  scheduleTime: {
    width: 70,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#666',
  },
  profileSection: {
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileId: {
    fontSize: 14,
    color: '#666',
  },
  settingSection: {
    marginTop: 10,
  },
  settingSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  locationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  alertNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  sosModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
  },
  sosModalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  confirmModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#4a80f5',
  },
  confirmModalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  attendanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shuttleIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  attendanceDetails: {
    flex: 1,
  },
  attendanceShuttleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  attendanceRoute: {
    fontSize: 14,
    color: '#666',
  },
  attendanceEta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a80f5',
    marginTop: 5,
  },
  attendanceNote: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
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
});
