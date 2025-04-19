import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Platform } from 'react-native';

// Import services
import { getBusInfo, getRoute, subscribeToBusLocation } from '../../services/index';

// Import components
import StudentHeader from './components/StudentHeader';
import StudentMap from './components/StudentMap';
import BusInfoCard from './components/BusInfoCard';
import QuickActions from './components/QuickActions';
import TrackingView from './components/TrackingView';
import ScheduleView from './components/ScheduleView';
import ProfileView from './components/ProfileView';
import BottomNavigation from './components/BottomNavigation';
import SOSModal from './components/SOSModal';
import AttendanceModal from './components/AttendanceModal';
import StudentSwitcher from './components/StudentSwitcher';

// Import styles
import { commonStyles } from '../../styles/commonStyles';
import { studentStyles } from '../../styles/studentStyles';

export default function StudentPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('home');
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [showAttendanceConfirmation, setShowAttendanceConfirmation] = useState(false);
  const [studentId, setStudentId] = useState('E22CSEU0001'); // Default to Aditya Banerjee
  const [studentName, setStudentName] = useState('Aditya Banerjee');
  const [busInfo, setBusInfo] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  // New state for student switcher
  const [showStudentSwitcher, setShowStudentSwitcher] = useState(false);
  // Track if user has confirmed attendance for any student
  const [confirmedAttendance, setConfirmedAttendance] = useState({});
  
  useEffect(() => {
    // Check if running on native platform
    setIsNativePlatform(Platform.OS !== 'web');
    
    // Load bus information and set up real-time listener
    const unsubscribe = subscribeToBusLocation((bus) => {
      setBusInfo(bus);
      
      // After getting bus info, load route details
      if (bus && bus.routeId) {
        getRoute(bus.routeId).then(routeData => {
          setRoute(routeData);
          setLoading(false);
        }).catch(error => {
          console.error("Error loading route data:", error);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    
    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);
  
  // User's current location (simulated - Greater Noida)
  const userLocation = { latitude: 28.4744, longitude: 77.5040 };
  
  // Bennett University location (destination)
  const bennettLocation = { latitude: 28.4501, longitude: 77.5859 };
  
  // Handle SOS alert
  const handleSOS = () => {
    setSosModalVisible(true);
  };
  
  // Handle attendance confirmation
  const handleConfirmAttendance = () => {
    setShowAttendanceConfirmation(true);
  };

  // Handle student change
  const handleStudentChange = (newStudentId, newStudentName) => {
    setStudentId(newStudentId);
    setStudentName(newStudentName);
    console.log(`Switched to student: ${newStudentName} (${newStudentId})`);
  };

  // Track successful attendance confirmations
  const handleAttendanceConfirmed = () => {
    setConfirmedAttendance(prev => ({
      ...prev,
      [studentId]: true
    }));
  };

  // Loading state
  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={{ marginTop: 15 }}>Loading bus information...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <StudentHeader router={router} />

      {/* Student Switcher and Test Mode Bar */}
      <View style={studentStyles.controlBar}>
        {/* Test mode indicator */}
        <View style={studentStyles.testModeIndicator}>
          <Text style={studentStyles.testModeText}>TEST MODE</Text>
        </View>

        {/* Student Switcher Button */}
        <TouchableOpacity 
          style={studentStyles.studentSwitcherButton}
          onPress={() => setShowStudentSwitcher(true)}
        >
          <Ionicons name="people" size={16} color="#4a80f5" />
          <Text style={studentStyles.studentSwitcherText}>
            {studentName} (Switch Student)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={commonStyles.contentContainer}>
        {currentTab === 'home' && (
          <>
            {/* Map View */}
            <StudentMap 
              isNativePlatform={isNativePlatform}
              userLocation={userLocation}
              bennettLocation={bennettLocation}
              busInfo={busInfo}
              handleSOS={handleSOS}
            />

            {/* Campus Bus Section */}
            <BusInfoCard 
              loading={loading}
              busInfo={busInfo}
              route={route}
              handleConfirmAttendance={handleConfirmAttendance}
              isAttendanceConfirmed={confirmedAttendance[studentId]}
            />

            {/* Quick Actions */}
            <QuickActions setCurrentTab={setCurrentTab} />
          </>
        )}
        
        {currentTab === 'tracking' && (
          <TrackingView busInfo={busInfo} route={route} />
        )}
        
        {currentTab === 'schedule' && (
          <ScheduleView busInfo={busInfo} route={route} />
        )}
        
        {currentTab === 'profile' && (
          <ProfileView studentId={studentId} studentName={studentName} />
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* SOS Modal */}
      <SOSModal 
        visible={sosModalVisible}
        setVisible={setSosModalVisible}
      />

      {/* Attendance Confirmation Modal */}
      <AttendanceModal
        visible={showAttendanceConfirmation}
        setVisible={setShowAttendanceConfirmation}
        busInfo={busInfo}
        route={route}
        studentId={studentId}
        studentName={studentName}
        onAttendanceConfirmed={handleAttendanceConfirmed}
      />

      {/* Student Switcher Modal */}
      <StudentSwitcher
        visible={showStudentSwitcher}
        setVisible={setShowStudentSwitcher}
        currentStudentId={studentId}
        onStudentChange={handleStudentChange}
      />
    </View>
  );
}