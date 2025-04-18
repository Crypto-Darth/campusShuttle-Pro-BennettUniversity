import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform, Switch, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// REMOVE THESE PROBLEMATIC IMPORTS - they create a circular reference
// import { getBusInfo, confirmAttendance, subscribeToBusLocation, getRoute } from '../services/shuttleService';

// Add this initialization check at the beginning of the file

// Check if collections exist and create them if needed
const ensureCollectionsExist = async () => {
  try {
    // Check if the attendance collection exists and has any documents
    const attendanceSnapshot = await getDocs(attendanceCollection);
    console.log(`Attendance collection has ${attendanceSnapshot.size} documents`);
    
    // If there are no documents, we can add a test document to ensure the collection exists
    if (attendanceSnapshot.size === 0) {
      console.log("Creating test attendance document to ensure collection exists");
      await addDoc(attendanceCollection, {
        studentId: 'test-student',
        shuttleId: 'test-shuttle',
        pickupLocation: 'Test Location',
        status: 'test',
        timestamp: serverTimestamp(),
        displayName: 'Test Student',
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error ensuring collections exist:", error);
  }
};

// Call this function early in the app lifecycle
ensureCollectionsExist();

/**
 * Safely format a Firestore timestamp
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown time';
  
  try {
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleTimeString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    } else if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleTimeString();
    }
    return 'Invalid timestamp';
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid timestamp';
  }
}

// Collection references
const busCollection = collection(db, 'bus');
const routeCollection = collection(db, 'route');
const studentsCollection = collection(db, 'students');
const attendanceCollection = collection(db, 'attendance');

// ===== BUS FUNCTIONS =====

/**
 * Get the bus info
 */
export const getBusInfo = async () => {
  try {
    const snapshot = await getDocs(busCollection);
    if (snapshot.docs.length > 0) {
      // Return the first (and only) bus
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }
    // If no bus found, return mock data
    return getMockBus();
  } catch (error) {
    console.error("Error getting bus info:", error);
    // Return mock data if Firebase fails
    return getMockBus();
  }
};

/**
 * Subscribe to bus location updates
 */
export const subscribeToBusLocation = (callback) => {
  try {
    return onSnapshot(busCollection, (snapshot) => {
      if (snapshot.docs.length > 0) {
        callback({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        });
      } else {
        // If no bus in database, use mock data
        callback(getMockBus());
      }
    }, error => {
      console.error("Error subscribing to bus:", error);
      // Fall back to mock data on error
      callback(getMockBus());
    });
  } catch (error) {
    console.error("Error setting up bus subscription:", error);
    // Return a dummy unsubscribe function
    callback(getMockBus());
    return () => {};
  }
};

/**
 * Update bus location (for driver)
 */
export const updateBusLocation = async (busId, location) => {
  try {
    // Don't proceed if no bus ID is provided
    if (!busId) {
      console.log('No bus ID provided for location update');
      return;
    }
    
    const busRef = doc(db, 'bus', busId);
    const busSnapshot = await getDoc(busRef);
    
    if (!busSnapshot.exists()) {
      console.log(`Bus ${busId} doesn't exist in Firebase`);
      
      // Create the bus if it doesn't exist
      await setDoc(busRef, {
        name: 'Campus Bus',
        driverId: 'driver1',
        capacity: 20,
        location: location,
        status: 'active',
        lastUpdated: serverTimestamp()
      });
      console.log(`Created new bus with ID: ${busId}`);
      return;
    }
    
    // Update existing bus
    await updateDoc(busRef, {
      location,
      lastUpdated: serverTimestamp()
    });
    console.log(`Updated location for bus ${busId}`);
  } catch (error) {
    console.error("Error updating bus location:", error);
  }
};

// ===== ROUTE FUNCTIONS =====

/**
 * Get the route info
 */
export const getRoute = async () => {
  try {
    const snapshot = await getDocs(routeCollection);
    if (snapshot.docs.length > 0) {
      // Return the first (and only) route
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }
    // If no route found, return mock data
    return getMockRoute();
  } catch (error) {
    console.error("Error getting route:", error);
    // Return mock data if Firebase fails
    return getMockRoute();
  }
};

// ===== ATTENDANCE FUNCTIONS =====

/**
 * Confirm student attendance for the bus
 */
export const confirmAttendance = async (studentId, pickupLocation) => {
  try {
    console.log(`Confirming attendance: studentId=${studentId}, pickupLocation=${pickupLocation}`);
    
    // Get the bus ID
    let busId = 'bus1'; // Default ID
    try {
      const bus = await getBusInfo();
      if (bus && bus.id) {
        busId = bus.id;
      }
    } catch (error) {
      console.error("Error getting bus ID:", error);
    }
    
    // Create a proper attendance record with all required fields
    const attendanceData = {
      studentId,
      busId,
      pickupLocation,
      status: 'confirmed',
      timestamp: serverTimestamp(),
      displayName: `Student ${studentId}`,
      createdAt: new Date().toISOString()
    };
    
    console.log("Adding attendance record with data:", JSON.stringify(attendanceData));
    
    // Add the attendance record to Firestore
    const docRef = await addDoc(attendanceCollection, attendanceData);
    console.log(`Successfully added attendance record with ID: ${docRef.id}`);
    
    return docRef;
  } catch (error) {
    console.error("Error confirming attendance:", error);
    throw error;
  }
};

/**
 * Subscribe to attendance changes (for the driver)
 */
export const subscribeToAttendance = (callback) => {
  try {
    console.log(`Setting up attendance subscription`);
    
    // Create a query to get all attendance records sorted by timestamp
    const q = query(attendanceCollection);
    
    // Listen for real-time updates
    return onSnapshot(q, (snapshot) => {
      // Process the snapshot
      const attendanceList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle the timestamp display safely
          displayTime: data.timestamp ? formatTimestamp(data.timestamp) : new Date().toLocaleTimeString()
        };
      });
      
      console.log(`Received ${attendanceList.length} attendance records`);
      
      // Send the attendance records to the callback
      callback(attendanceList);
    }, error => {
      console.error(`Error in attendance subscription:`, error);
      callback([]);
    });
  } catch (error) {
    console.error("Error setting up attendance subscription:", error);
    callback([]);
    return () => {};
  }
};

// ===== MOCK DATA FUNCTIONS =====

/**
 * Get mock bus data for development/fallback
 */
function getMockBus() {
  return { 
    id: "bus1", 
    name: 'Campus Bus', 
    driverId: 'driver1',
    capacity: 20,
    location: { latitude: 37.78825, longitude: -122.4324 },
    status: 'active',
    eta: '5 min'
  };
}

/**
 * Get mock route for development/fallback
 */
function getMockRoute() {
  return {
    id: "route1",
    name: 'Campus Route',
    description: 'Main Campus → Dorms → Library',
    stops: [
      {
        name: 'Main Campus',
        address: '123 University Ave',
        location: {
          latitude: 37.78825,
          longitude: -122.4324
        },
        scheduledTime: '7:30 AM',
        students: 4
      },
      {
        name: 'Dorms',
        address: '789 Residence Rd',
        location: {
          latitude: 37.78425,
          longitude: -122.4354
        },
        scheduledTime: '7:45 AM',
        students: 2
      },
      {
        name: 'Library',
        address: '456 Book St',
        location: {
          latitude: 37.78625,
          longitude: -122.4344
        },
        scheduledTime: '8:00 AM',
        students: 3
      }
    ],
    coordinates: [
      { latitude: 37.78825, longitude: -122.4324 },
      { latitude: 37.78425, longitude: -122.4354 },
      { latitude: 37.78625, longitude: -122.4344 }
    ],
    estimatedDuration: 30 // minutes
  };
}

/**
 * Utility function to verify attendance records and troubleshoot issues
 */
export const debugAttendanceData = async () => {
  try {
    console.log(`DEBUG: Checking attendance data`);
    
    // Check all attendance records
    const allAttendance = await getDocs(attendanceCollection);
    console.log(`DEBUG: Total attendance records in database: ${allAttendance.size}`);
    
    // Log all attendance documents
    allAttendance.forEach(doc => {
      console.log(`DEBUG: Record ${doc.id}:`, JSON.stringify(doc.data()));
    });
    
    return true;
  } catch (error) {
    console.error("DEBUG: Error checking attendance data:", error);
    return false;
  }
};