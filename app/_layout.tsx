import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from 'react-native'; // Add this specific import
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function RootLayout() {
  useEffect(() => {
    // Test Firebase connection thoroughly
    const testFirebaseConnection = async () => {
      try {
        console.log('Testing Firebase connection...');
        
        // 1. Try to read from a collection
        const shuttlesSnapshot = await getDocs(collection(db, 'shuttles'));
        console.log(`Read test: Found ${shuttlesSnapshot.size} shuttles`);
        
        // 2. Try to create a test document
        const testCollection = collection(db, 'connection_tests');
        const testDoc = await addDoc(testCollection, {
          timestamp: serverTimestamp(),
          message: 'Connection test',
          device: Platform.OS,
          time: new Date().toISOString()
        });
        
        console.log(`Write test: Created test document with ID: ${testDoc.id}`);
        console.log('Firebase connection is working properly');
      } catch (error) {
        console.error('Firebase connection error:', error);
      }
    };
    
    testFirebaseConnection();
  }, []);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="student" />
      <Stack.Screen name="driver" />
    </Stack>
  );
}
