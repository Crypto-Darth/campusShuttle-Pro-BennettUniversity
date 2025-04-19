import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentStyles } from '../../../styles/studentStyles';

const ProfileView = ({ studentId, studentName }) => {
  return (
    <View style={studentStyles.sectionContainer}>
      <Text style={studentStyles.sectionTitle}>My Profile</Text>
      
      <View style={studentStyles.profileSection}>
        <View style={studentStyles.profileHeader}>
          <View style={studentStyles.profileAvatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <View style={studentStyles.profileInfo}>
            <Text style={studentStyles.profileName}>{studentName}</Text>
            <Text style={studentStyles.profileId}>ID: {studentId}</Text>
          </View>
        </View>
        
        <View style={studentStyles.settingSection}>
          <Text style={studentStyles.settingSectionTitle}>Preferences</Text>
          
          <View style={studentStyles.settingItem}>
            <View style={studentStyles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <Text style={studentStyles.settingLabel}>Notifications</Text>
            </View>
            <Switch 
              value={true} 
              onValueChange={() => {}} 
              trackColor={{ false: "#ccc", true: "#4a80f5" }}
            />
          </View>
          
          <View style={studentStyles.settingItem}>
            <View style={studentStyles.settingLabelContainer}>
              <Ionicons name="location-outline" size={24} color="#333" />
              <Text style={studentStyles.settingLabel}>Location Sharing</Text>
            </View>
            <Switch 
              value={true} 
              onValueChange={() => {}} 
              trackColor={{ false: "#ccc", true: "#4a80f5" }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileView;