import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { driverStyles } from '../../../styles/driverStyles';

const StudentsList = ({ busInfo, attendanceList, loading }) => {
  return (
    <ScrollView style={driverStyles.contentContainer}>
      <View style={driverStyles.studentsContent}>
        <Text style={driverStyles.studentsTitle}>Confirmed Students</Text>
        <Text style={driverStyles.studentsDescription}>Students who have confirmed their attendance</Text>
        
        {/* Debug info */}
        <View style={driverStyles.debugBox}>
          <Text style={driverStyles.debugText}>Bus ID: {busInfo?.id || 'None'}</Text>
          <Text style={driverStyles.debugText}>Students confirmed: {attendanceList.length}</Text>
        </View>
        
        {loading ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#34c759" />
            <Text style={{marginTop: 10}}>Loading confirmed students...</Text>
          </View>
        ) : !busInfo ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={driverStyles.noDataText}>No bus information available</Text>
          </View>
        ) : attendanceList.length === 0 ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={driverStyles.noDataText}>No students have confirmed attendance yet</Text>
            <Text style={{fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8}}>
              When students confirm attendance, they'll appear here
            </Text>
          </View>
        ) : (
          // Group by pickup location
          Object.entries(
            attendanceList.reduce((grouped, attendance) => {
              const location = attendance.pickupLocation || 'Unknown Location';
              if (!grouped[location]) grouped[location] = [];
              grouped[location].push(attendance);
              return grouped;
            }, {})
          ).map(([location, students]) => (
            <View key={location} style={driverStyles.stopStudentsSection}>
              <View style={driverStyles.stopHeaderRow}>
                <Text style={driverStyles.stopHeaderTitle}>{location}</Text>
                <Text style={driverStyles.stopHeaderCount}>{students.length} students</Text>
              </View>
              
              {students.map(student => (
                <View key={student.id} style={driverStyles.studentCard}>
                  <View style={driverStyles.studentAvatar}>
                    <Ionicons name="person" size={24} color="#fff" />
                  </View>
                  <View style={driverStyles.studentInfo}>
                    <Text style={driverStyles.studentName}>
                      {student.displayName || `Student #${student.studentId}`}
                    </Text>
                    <Text style={driverStyles.studentConfirmed}>
                      {student.timestamp ? 
                        `Confirmed at ${student.displayTime}` : 
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
    </ScrollView>
  );
};

export default StudentsList;