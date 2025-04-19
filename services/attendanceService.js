import { 
  getDocs, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { attendanceCollection } from './shuttleService';
import { getBusInfo } from './busService';
import { db } from '../firebase';

// Import the utility function
import { formatTimestamp } from './utils/dateUtils';

/**
 * Confirm student attendance for a bus
 */
export const confirmAttendance = async (studentId, pickupLocation, studentName = null) => {
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
      displayName: studentName || `Student ${studentId}`,
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
 * Subscribe to attendance changes for a specific bus
 */
export const subscribeToAttendanceByBusId = (busId, callback) => {
  try {
    console.log(`Setting up attendance subscription for bus: ${busId}`);
    
    if (!busId) {
      console.error("No bus ID provided for attendance subscription");
      callback([]);
      return () => {};
    }
    
    const q = query(attendanceCollection, where('busId', '==', busId));
    
    return onSnapshot(q, (snapshot) => {
      const attendanceList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          displayTime: data.timestamp ? formatTimestamp(data.timestamp) : new Date().toLocaleTimeString()
        };
      });
      
      console.log(`Received ${attendanceList.length} attendance records for bus ${busId}`);
      callback(attendanceList);
    }, error => {
      console.error(`Error in attendance subscription for bus ${busId}:`, error);
      callback([]);
    });
  } catch (error) {
    console.error("Error setting up attendance subscription:", error);
    callback([]);
    return () => {};
  }
};

/**
 * Subscribe to all attendance changes (for the driver)
 */
export const subscribeToAttendance = (callback) => {
  try {
    console.log(`Setting up general attendance subscription`);
    
    // Listen for real-time updates
    return onSnapshot(attendanceCollection, (snapshot) => {
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
      
      console.log(`Received ${attendanceList.length} total attendance records`);
      
      // Send the attendance records to the callback
      callback(attendanceList);
    }, error => {
      console.error(`Error in general attendance subscription:`, error);
      callback([]);
    });
  } catch (error) {
    console.error("Error setting up attendance subscription:", error);
    callback([]);
    return () => {};
  }
};

/**
 * Utility function to verify attendance records and troubleshoot issues
 */
export const debugAttendanceData = async (busId = null) => {
  try {
    console.log(`DEBUG: Checking attendance data${busId ? ` for bus ${busId}` : ''}`);
    
    // Check all attendance records
    let q = attendanceCollection;
    if (busId) {
      q = query(attendanceCollection, where('busId', '==', busId));
    }
    
    const allAttendance = await getDocs(q);
    console.log(`DEBUG: Found ${allAttendance.size} attendance records${busId ? ` for bus ${busId}` : ''}`);
    
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