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

// Utils
import { formatTimestamp } from './utils/dateUtils';

// Collection references
export const busCollection = collection(db, 'buses');
export const routeCollection = collection(db, 'routes');
export const studentsCollection = collection(db, 'students');
export const attendanceCollection = collection(db, 'attendance');

// Initialization function
export const initializeDatabase = async () => {
  try {
    await ensureCollectionsExist();
    await seedInitialDataIfEmpty();
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

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
        busId: 'test-bus',
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

// Seed initial data if collections are empty
const seedInitialDataIfEmpty = async () => {
  try {
    // Check if we have buses
    const busesSnapshot = await getDocs(busCollection);
    if (busesSnapshot.docs.length > 0) {
      console.log("Buses already exist, skipping initialization");
      return;
    }
    
    console.log("No buses found, initializing default data...");
    
    // Add the Greater Noida routes
    const routes = [
      {
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
            students: 3
          },
          {
            name: 'Beta 1',
            address: 'Beta 1, Greater Noida, UP, India',
            location: {
              latitude: 28.4808,
              longitude: 77.5087
            },
            scheduledTime: '7:45 AM',
            students: 4
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
        name: 'Route B - Bennett Pari Chowk Route',
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
            students: 2
          },
          {
            name: 'Knowledge Park',
            address: 'Knowledge Park, Greater Noida, UP, India',
            location: {
              latitude: 28.4741,
              longitude: 77.4949
            },
            scheduledTime: '7:50 AM',
            students: 2
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
        name: 'Route C - Bennett Gamma Route',
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
            students: 1
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
    
    // Add routes to database
    const routeRefs = [];
    for (const route of routes) {
      const docRef = await addDoc(routeCollection, route);
      routeRefs.push({ id: docRef.id, ...route });
      console.log(`Added route with ID: ${docRef.id}`);
    }
    
    // Add the buses
    const buses = [
      {
        name: 'Bus Alpha',
        driverId: 'driver1',
        routeId: routeRefs[0].id,
        capacity: 20,
        location: routeRefs[0].stops[0].location,
        status: 'active',
        eta: '45 min'
      },
      {
        name: 'Bus Beta',
        driverId: 'driver2',
        routeId: routeRefs[1].id,
        capacity: 18,
        location: routeRefs[1].stops[0].location,
        status: 'active',
        eta: '50 min'
      },
      {
        name: 'Bus Gamma',
        driverId: 'driver3',
        routeId: routeRefs[2].id,
        capacity: 22,
        location: routeRefs[2].stops[0].location,
        status: 'active',
        eta: '50 min'
      }
    ];
    
    // Add buses to database
    for (const bus of buses) {
      const docRef = await addDoc(busCollection, bus);
      console.log(`Added bus with ID: ${docRef.id}`);
    }
    
    // Add students
    const students = [
      {
        studentId: 'E22CSEU0001',
        name: 'Aditya Banerjee',
        email: 'aditya.banerjee@bennett.edu.in',
        preferredPickupLocation: 'Alpha 1'
      },
      {
        studentId: 'E22CSEU0002',
        name: 'Kshitiz Yadav',
        email: 'kshitiz.yadav@bennett.edu.in',
        preferredPickupLocation: 'Pari Chowk'
      },
      {
        studentId: 'E22CSEU0003',
        name: 'Sneyank Das',
        email: 'sneyank.das@bennett.edu.in',
        preferredPickupLocation: 'Gamma I'
      },
      {
        studentId: 'E22CSEU0004',
        name: 'Samir Chowdhary',
        email: 'samir.chowdhary@bennett.edu.in',
        preferredPickupLocation: 'Beta 1'
      }
    ];
    
    // Add students to database
    for (const student of students) {
      const docRef = await addDoc(studentsCollection, student);
      console.log(`Added student with ID: ${docRef.id}`);
    }
    
    console.log('Database initialized successfully with Bennett University routes');
    return true;
  } catch (error) {
    console.error("Error initializing data:", error);
    return false;
  }
};

// Export debug function
export { debugAttendanceData } from './attendanceService';