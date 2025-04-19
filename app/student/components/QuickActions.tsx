import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const QuickActions = ({ setCurrentTab }) => {
  return (
    <View style={studentStyles.sectionContainer}>
      <Text style={studentStyles.sectionTitle}>Quick Actions</Text>
      <View style={studentStyles.actionsContainer}>
        <TouchableOpacity 
          style={studentStyles.actionButton} 
          onPress={() => setCurrentTab('schedule')}
        >
          <Ionicons name="calendar-outline" size={24} color="#4a80f5" />
          <Text style={studentStyles.actionText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={studentStyles.actionButton} 
          onPress={() => setCurrentTab('tracking')}
        >
          <Ionicons name="location-outline" size={24} color="#4a80f5" />
          <Text style={studentStyles.actionText}>Track</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={studentStyles.actionButton} 
          onPress={() => setCurrentTab('profile')}
        >
          <Ionicons name="settings-outline" size={24} color="#4a80f5" />
          <Text style={studentStyles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuickActions;