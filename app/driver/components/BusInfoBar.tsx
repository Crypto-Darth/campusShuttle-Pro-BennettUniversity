import React from 'react';
import { View, Text } from 'react-native';
import { driverStyles } from '../../../styles/driverStyles';

const BusInfoBar = ({ busInfo }) => {
  if (!busInfo) return null;
  
  return (
    <View style={driverStyles.busInfo}>
      <Text style={driverStyles.busTitle}>{busInfo.name || "Campus Bus"}</Text>
      <Text style={driverStyles.busStatus}>
        Status: <Text style={{color: '#34c759'}}>{busInfo.status || "Active"}</Text>
      </Text>
    </View>
  );
};

export default BusInfoBar;