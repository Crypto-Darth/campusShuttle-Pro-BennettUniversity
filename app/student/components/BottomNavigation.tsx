import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const BottomNavigation = ({ currentTab, setCurrentTab }) => {
  return (
    <View style={studentStyles.bottomNav}>
      <TouchableOpacity 
        style={[studentStyles.navItem, currentTab === 'home' && studentStyles.activeNavItem]} 
        onPress={() => setCurrentTab('home')}
      >
        <Ionicons name="home" size={24} color={currentTab === 'home' ? '#4a80f5' : '#888'} />
        <Text style={[studentStyles.navText, currentTab === 'home' && studentStyles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[studentStyles.navItem, currentTab === 'tracking' && studentStyles.activeNavItem]} 
        onPress={() => setCurrentTab('tracking')}
      >
        <Ionicons name="location" size={24} color={currentTab === 'tracking' ? '#4a80f5' : '#888'} />
        <Text style={[studentStyles.navText, currentTab === 'tracking' && studentStyles.activeNavText]}>Track</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[studentStyles.navItem, currentTab === 'schedule' && studentStyles.activeNavItem]} 
        onPress={() => setCurrentTab('schedule')}
      >
        <Ionicons name="calendar" size={24} color={currentTab === 'schedule' ? '#4a80f5' : '#888'} />
        <Text style={[studentStyles.navText, currentTab === 'schedule' && studentStyles.activeNavText]}>Schedule</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[studentStyles.navItem, currentTab === 'profile' && studentStyles.activeNavItem]} 
        onPress={() => setCurrentTab('profile')}
      >
        <Ionicons name="person" size={24} color={currentTab === 'profile' ? '#4a80f5' : '#888'} />
        <Text style={[studentStyles.navText, currentTab === 'profile' && studentStyles.activeNavText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;