import {
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  addDoc,
  collection,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { formatTimestamp } from './utils/dateUtils';

// Collection references
const busCollection = collection(db, 'buses');
const routeCollection = collection(db, 'routes');
const attendanceCollection = collection(db, 'attendance');
const studentsCollection = collection(db, 'students');

/**
 * Initialize database with Bennett University routes and students
 * Call this function when your app starts
 */
export const initializeDatabase = async () => {
  try {
    // Check if we already have buses
    const busesSnapshot = await getDocs(busCollection);
    if (busesSnapshot.docs.length > 0) {
      console.log("Buses already exist, skipping initialization");
      return true;
    }
    
    // Add Bennett University routes
    console.log('Initializing database with Bennett University routes...');
    
    const routes = [
      {
        name: 'Route A - Alpha-Beta Route',
        description: 'Alpha 1 → Beta 1 → Bennett University',
        stops: [
          {
            name: 'Alpha 1',
            address: 'Alpha 1, Greater Noida, UP, India',
            location: {
              latitude: 28.4669,
              longitude: 77.5128
            },
            scheduledTime: '7:30 AM',
            students: 2
          },
          {
            name: 'Beta 1',
            address: 'Beta 1, Greater Noida, UP, India',
            location: {
              latitude: 28.4808,
              longitude: 77.5087
            },
            scheduledTime: '7:45 AM',
            students: 1
          },
          {
            name: 'Bennett University',
            address: 'Bennett University, Greater Noida, UP, India',
            location: {
              latitude: 28.4501,
              longitude: 77.5859
            },
            scheduledTime: '8:15 AM',
            students: 0
          }
        ],
        coordinates: [
          { latitude: 28.4669, longitude: 77.5128 },
          { latitude: 28.4808, longitude: 77.5087 },
          { latitude: 28.4501, longitude: 77.5859 }
        ],
        estimatedDuration: 45 // minutes
      },
      {
        name: 'Route B - Pari Chowk Route',
        description: 'Pari Chowk → Knowledge Park → Bennett University',
        stops: [
          {
            name: 'Pari Chowk',
            address: 'Pari Chowk, Greater Noida, UP, India',
            location: {
              latitude: 28.4701,
              longitude: 77.5027
            },
            scheduledTime: '7:30 AM',
            students: 1
          },
          {
            name: 'Knowledge Park',
            address: 'Knowledge Park, Greater Noida, UP, India',
            location: {
              latitude: 28.4741,
              longitude: 77.4949
            },
            scheduledTime: '7:50 AM',
            students: 0
          },
          {
            name: 'Bennett University',
            address: 'Bennett University, Greater Noida, UP, India',
            location: {
              latitude: 28.4501,
              longitude: 77.5859
            },
            scheduledTime: '8:20 AM',
            students: 0
          }
        ],
        coordinates: [
          { latitude: 28.4701, longitude: 77.5027 },
          { latitude: 28.4741, longitude: 77.4949 },
          { latitude: 28.4501, longitude: 77.5859 }
        ],
        estimatedDuration: 50 // minutes
      },
      {
        name: 'Route C - Gamma Route',
        description: 'Gamma I → Gamma II → Bennett University',
        stops: [
          {
            name: 'Gamma I',
            address: 'Gamma I, Greater Noida, UP, India',
            location: {
              latitude: 28.4874,
              longitude: 77.5063
            },
            scheduledTime: '7:20 AM',
            students: 1
          },
          {
            name: 'Gamma II',
            address: 'Gamma II, Greater Noida, UP, India',
            location: {
              latitude: 28.4907,
              longitude: 77.5025
            },
            scheduledTime: '7:40 AM',
            students: 0
          },
          {
            name: 'Bennett University',
            address: 'Bennett University, Greater Noida, UP, India',
            location: {
              latitude: 28.4501,
              longitude: 77.5859
            },
            scheduledTime: '8:10 AM',
            students: 0
          }
        ],
        coordinates: [
          { latitude: 28.4874, longitude: 77.5063 },
          { latitude: 28.4907, longitude: 77.5025 },
          { latitude: 28.4501, longitude: 77.5859 }
        ],
        estimatedDuration: 50 // minutes
      }
    ];
    
    // Add routes to Firestore
    const routeIds = [];
    for (const route of routes) {
      const docRef = await addDoc(routeCollection, route);
      routeIds.push(docRef.id);
      console.log(`Added route ${route.name} with ID: ${docRef.id}`);
    }
    
    // Add buses (one for each route)
    const buses = [
      {
        name: 'Bus Alpha',
        driverId: 'driver1',
        routeId: routeIds[0],
        capacity: 20,
        location: {
          latitude: 28.4669,
          longitude: 77.5128
        },
        status: 'active',
        eta: '45 min'
      },
      {
        name: 'Bus Beta',
        driverId: 'driver2',
        routeId: routeIds[1],
        capacity: 18,
        location: {
          latitude: 28.4701,
          longitude: 77.5027
        },
        status: 'active',
        eta: '50 min'
      },
      {
        name: 'Bus Gamma',
        driverId: 'driver3',
        routeId: routeIds[2],
        capacity: 22,
        location: {
          latitude: 28.4874,
          longitude: 77.5063
        },
        status: 'active',
        eta: '50 min'
      }
    ];
    
    // Add buses to Firestore
    for (const bus of buses) {
      const docRef = await addDoc(busCollection, bus);
      console.log(`Added bus ${bus.name} with ID: ${docRef.id}`);
    }
    
    // Add students with their assigned routes
    const students = [
      {
        studentId: 'E22CSEU0001',
        name: 'Aditya Banerjee',
        email: 'aditya.banerjee@bennett.edu.in',
        preferredPickupLocation: 'Alpha 1',
        routeId: routeIds[0]
      },
      {
        studentId: 'E22CSEU0002',
        name: 'Kshitiz Yadav',
        email: 'kshitiz.yadav@bennett.edu.in',
        preferredPickupLocation: 'Pari Chowk',
        routeId: routeIds[1]
      },
      {
        studentId: 'E22CSEU0003',
        name: 'Sneyank Das',
        email: 'sneyank.das@bennett.edu.in',
        preferredPickupLocation: 'Gamma I',
        routeId: routeIds[2]
      },
      {
        studentId: 'E22CSEU0004',
        name: 'Samir Chowdhary',
        email: 'samir.chowdhary@bennett.edu.in',
        preferredPickupLocation: 'Beta 1',
        routeId: routeIds[0]
      }
    ];
    
    // Add students to Firestore
    for (const student of students) {
      const docRef = await addDoc(studentsCollection, student);
      console.log(`Added student ${student.name} with ID: ${docRef.id}`);
    }
    
    console.log('Database initialization with Bennett University routes complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

/**
 * Get all buses
 */
export const getAllBuses = async () => {
  try {
    const snapshot = await getDocs(busCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all buses:", error);
    return [];
  }
};

/**
 * Get bus by ID
 */
export const getBusById = async (busId) => {
  try {
    if (!busId) return getMockBus();
    
    const busDoc = await getDoc(doc(db, 'buses', busId));
    if (busDoc.exists()) {
      return {
        id: busDoc.id,
        ...busDoc.data()
      };
    }
    return getMockBus();
  } catch (error) {
    console.error(`Error getting bus with ID ${busId}:`, error);
    return getMockBus();
  }
};

/**
 * Get the default bus info
 */
export const getBusInfo = async () => {
  try {
    const snapshot = await getDocs(busCollection);
    if (snapshot.docs.length > 0) {
      // Return the first bus
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    }
    // If no bus found, return mock data
    return getMockBus();
  } catch (error) {
    console.error("Error getting bus info:", error);
    return getMockBus();
  }
};

/**
 * Get route by ID
 */
export const getRoute = async (routeId) => {
  try {
    if (routeId) {
      const routeDoc = await getDoc(doc(db, 'routes', routeId));
      if (routeDoc.exists()) {
        return {
          id: routeDoc.id,
          ...routeDoc.data()
        };
      }
    }
    
    // Fall back to getting first route in collection
    const routesSnapshot = await getDocs(routeCollection);
    if (routesSnapshot.docs.length > 0) {
      return {
        id: routesSnapshot.docs[0].id,
        ...routesSnapshot.docs[0].data()
      };
    }
    
    // If no route found, return mock data
    return getMockRoute();
  } catch (error) {
    console.error("Error getting route:", error);
    return getMockRoute();
  }
};

/**
 * Subscribe to bus location updates
 */
export const subscribeToBusLocation = (callback) => {
  try {
    return onSnapshot(busCollection, (snapshot) => {
      if (snapshot.docs.length > 0) {
        // Return the first bus by default
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
    callback(getMockBus());
    return () => {};
  }
};

/**
 * Update bus location (for driver)
 */
export const updateBusLocation = async (busId, location) => {
  try {
    if (!busId) {
      console.log('No bus ID provided for location update');
      return;
    }
    
    const busRef = doc(db, 'buses', busId);
    const busSnapshot = await getDoc(busRef);
    
    if (!busSnapshot.exists()) {
      console.log(`Bus ${busId} doesn't exist in Firebase`);
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

/**
 * Confirm student attendance for a bus
 */
export const confirmAttendance = async (studentId, pickupLocation, studentName = null) => {
  try {
    // Find student in database to get their name
    if (!studentName) {
      try {
        const studentQuery = query(studentsCollection, where('studentId', '==', studentId));
        const studentSnapshot = await getDocs(studentQuery);
        if (!studentSnapshot.empty) {
          studentName = studentSnapshot.docs[0].data().name;
        }
      } catch (error) {
        console.error("Error getting student name:", error);
      }
    }
    
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
    
    console.log(`Confirming attendance for ${studentName || studentId} at ${pickupLocation} on bus ${busId}`);
    
    // Create attendance record
    const attendanceData = {
      studentId,
      busId,
      pickupLocation,
      status: 'confirmed',
      timestamp: serverTimestamp(),
      displayName: studentName || `Student ${studentId}`,
      createdAt: new Date().toISOString()
    };
    
    // Add to Firestore
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
    return onSnapshot(attendanceCollection, (snapshot) => {
      const attendanceList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          displayTime: data.timestamp ? formatTimestamp(data.timestamp) : new Date().toLocaleTimeString()
        };
      });
      
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

/**
 * Get mock bus data for development/fallback
 */
function getMockBus() {
  return { 
    id: "bus1", 
    name: 'Bus Alpha', 
    driverId: 'driver1',
    routeId: 'route1',
    capacity: 20,
    location: { latitude: 28.4669, longitude: 77.5128 },
    status: 'active',
    eta: '45 min'
  };
}

/**
 * Get mock route for development/fallback
 */
function getMockRoute() {
  return {
    id: "route1",
    name: 'Route A - Bennett Main Route',
    description: 'Alpha 1 → Beta 1 → Bennett University',
    stops: [
      {
        name: 'Alpha 1',
        address: 'Alpha 1, Greater Noida, UP, India',
        location: {
          latitude: 28.4669,
          longitude: 77.5128
        },
        scheduledTime: '7:30 AM',
        students: 2
      },
      {
        name: 'Beta 1',
        address: 'Beta 1, Greater Noida, UP, India',
        location: {
          latitude: 28.4808,
          longitude: 77.5087
        },
        scheduledTime: '7:45 AM',
        students: 1
      },
      {
        name: 'Bennett University',
        address: 'Bennett University, Greater Noida, UP, India',
        location: {
          latitude: 28.4501,
          longitude: 77.5859
        },
        scheduledTime: '8:15 AM',
        students: 0
      }
    ],
    coordinates: [
      { latitude: 28.4669, longitude: 77.5128 },
      { latitude: 28.4808, longitude: 77.5087 },
      { latitude: 28.4501, longitude: 77.5859 }
    ],
    estimatedDuration: 45 // minutes
  };
}