import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { driverStyles } from '../../../styles/driverStyles';

const TabSelector = ({ currentTab, setCurrentTab }) => {
  return (
    <View style={driverStyles.tabsContainer}>
      <TouchableOpacity 
        style={[driverStyles.tab, currentTab === 'route' && driverStyles.activeTab]} 
        onPress={() => setCurrentTab('route')}
      >
        <Ionicons 
          name="map" 
          size={24} 
          color={currentTab === 'route' ? '#4a80f5' : '#888'} 
        />
        <Text style={[driverStyles.tabText, currentTab === 'route' && driverStyles.activeTabText]}>
          Route
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[driverStyles.tab, currentTab === 'students' && driverStyles.activeTab]} 
        onPress={() => setCurrentTab('students')}
      >
        <Ionicons 
          name="people" 
          size={24} 
          color={currentTab === 'students' ? '#4a80f5' : '#888'} 
        />
        <Text style={[driverStyles.tabText, currentTab === 'students' && driverStyles.activeTabText]}>
          Students
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSelector;