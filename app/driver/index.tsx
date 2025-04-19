import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { useRouter } from "expo-router";

// Import services 
import { getBusInfo, getRoute, updateBusLocation, subscribeToAttendance, debugAttendanceData } from '../../services/busService';

// Import components
import DriverHeader from './components/DriverHeader';
import BusInfoBar from './components/BusInfoBar';
import DriverMap from './components/DriverMap';
import TabSelector from './components/TabSelector';
import RouteDetails from './components/RouteDetails';
import StudentsList from './components/StudentsList';

// Import styles
import { commonStyles } from '../../styles/commonStyles';
import { driverStyles } from '../../styles/driverStyles';

export default function DriverPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('route');
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [route, setRoute] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [driverId, setDriverId] = useState('driver1');
  
  // Greater Noida location (for Bennett University route)
  const driverLocation = { latitude: 28.4669, longitude: 77.5128 };

  useEffect(() => {
    // Check if running on native platform
    setIsNativePlatform(Platform.OS !== 'web');
    
    // Load route and bus info
    const loadData = async () => {
      try {
        // Load bus info first
        const bus = await getBusInfo();
        setBusInfo(bus);
        
        // Then load the route for this bus
        if (bus && bus.routeId) {
          const routeData = await getRoute(bus.routeId);
          setRoute(routeData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up attendance subscription for this bus
    let unsubscribe = () => {};
    if (busInfo?.id) {
      unsubscribe = subscribeToAttendance((attendance) => {
        console.log(`Received ${attendance.length} attendance records for bus ${busInfo.id}`);
        setAttendanceList(attendance);
      });
      
      // Debug attendance data
      debugAttendanceData()
        .then(() => console.log("Attendance debug complete"))
        .catch(error => console.error("Error debugging attendance:", error));
    }
    
    // Location update interval for the bus
    let locationInterval = null;
    
    if (isNativePlatform && busInfo?.id) {
      // Simulate movement by updating location periodically
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

  // Loading state
  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.loadingContainer]}>
        <ActivityIndicator size="large" color="#34c759" />
        <Text style={{ marginTop: 15, fontSize: 16 }}>Loading route...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <DriverHeader router={router} />

      {/* Bus Info Bar */}
      <BusInfoBar busInfo={busInfo} />

      {/* Map View */}
      <DriverMap 
        isNativePlatform={isNativePlatform}
        route={route}
        driverLocation={driverLocation}
      />

      {/* Tab Selector */}
      <TabSelector 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Content based on selected tab */}
      {currentTab === 'route' ? (
        <RouteDetails route={route} />
      ) : (
        <StudentsList 
          busInfo={busInfo}
          attendanceList={attendanceList}
          loading={loading}
        />
      )}
    </View>
  );
}