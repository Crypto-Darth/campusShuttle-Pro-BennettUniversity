import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../../styles/commonStyles';
import { studentStyles } from '../../../styles/studentStyles';

const StudentHeader = ({ router }) => {
  return (
    <View style={[commonStyles.header, studentStyles.header]}>
      <Text style={commonStyles.headerTitle}>Student View</Text>
      <TouchableOpacity 
        style={commonStyles.switchButton} 
        onPress={() => router.push('/')}
      >
        <Text style={commonStyles.switchButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentHeader;