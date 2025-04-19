import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { initializeDatabase } from '../services/busService';

export default function RootLayout() {
  useEffect(() => {
    // Test and initialize Firebase database
    const setupDatabase = async () => {
      try {
        console.log('Testing Firebase connection...');
        
        // First check if we can connect to Firebase
        const shuttlesSnapshot = await getDocs(collection(db, 'buses'));
        console.log(`Found ${shuttlesSnapshot.size} buses in the database`);
        
        // Initialize database with Bennett University routes, buses, and students
        await initializeDatabase();
        
      } catch (error) {
        console.error('Firebase connection/initialization error:', error);
      }
    };
    
    setupDatabase();
  }, []);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="student/index" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="driver/index" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
