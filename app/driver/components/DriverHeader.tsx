import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../../styles/commonStyles';
import { driverStyles } from '../../../styles/driverStyles';

const DriverHeader = ({ router }) => {
  return (
    <View style={[commonStyles.header, driverStyles.header]}>
      <Text style={commonStyles.headerTitle}>Driver View</Text>
      <TouchableOpacity 
        style={commonStyles.switchButton} 
        onPress={() => router.push('/')}
      >
        <Text style={commonStyles.switchButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverHeader;