import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Shuttle</Text>
      <Text style={styles.subtitle}>Select your role:</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/student')}
        >
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.driverButton]} 
          onPress={() => router.push('/driver')}
        >
          <Text style={styles.buttonText}>Driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a80f5',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  button: {
    backgroundColor: '#4a80f5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  driverButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});