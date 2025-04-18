import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Function to seed the database with initial data
export const seedDatabase = async () => {
  try {
    // Add routes
    const routes = [
      {
        name: 'Route A',
        description: 'Main Campus → Dorms',
        stops: [
          {
            name: 'Main Campus',
            address: '123 University Ave',
            location: {
              latitude: 37.78825,
              longitude: -122.4324
            },
            scheduledTime: '7:30 AM'
          },
          {
            name: 'Library',
            address: '456 Book St',
            location: {
              latitude: 37.78625,
              longitude: -122.4344
            },
            scheduledTime: '7:45 AM'
          },
          {
            name: 'Dorms',
            address: '789 Residence Rd',
            location: {
              latitude: 37.78425,
              longitude: -122.4354
            },
            scheduledTime: '8:00 AM'
          }
        ],
        coordinates: [
          { latitude: 37.78825, longitude: -122.4324 },
          { latitude: 37.78625, longitude: -122.4344 },
          { latitude: 37.78425, longitude: -122.4354 }
        ],
        estimatedDuration: 30 // minutes
      },
      {
        name: 'Route B',
        description: 'Library → Sports Complex',
        stops: [
          {
            name: 'Library',
            address: '456 Book St',
            location: {
              latitude: 37.78625,
              longitude: -122.4344
            },
            scheduledTime: '8:00 AM'
          },
          {
            name: 'Student Center',
            address: '555 Center Ave',
            location: {
              latitude: 37.78525,
              longitude: -122.4304
            },
            scheduledTime: '8:15 AM'
          },
          {
            name: 'Sports Complex',
            address: '999 Athletic Dr',
            location: {
              latitude: 37.78325,
              longitude: -122.4264
            },
            scheduledTime: '8:30 AM'
          }
        ],
        coordinates: [
          { latitude: 37.78625, longitude: -122.4344 },
          { latitude: 37.78525, longitude: -122.4304 },
          { latitude: 37.78325, longitude: -122.4264 }
        ],
        estimatedDuration: 30 // minutes
      }
    ];

    // Add routes to database
    const routeIds = [];
    for (const route of routes) {
      const docRef = await addDoc(collection(db, 'routes'), route);
      routeIds.push(docRef.id);
    }
    
    // Add shuttles
    const shuttles = [
      {
        name: 'Shuttle A',
        driverId: 'driver1',
        routeId: routeIds[0], // Route A
        capacity: 20,
        location: {
          latitude: 37.78825,
          longitude: -122.4324
        },
        status: 'active'
      },
      {
        name: 'Shuttle B',
        driverId: 'driver2',
        routeId: routeIds[1], // Route B
        capacity: 15,
        location: {
          latitude: 37.78625,
          longitude: -122.4344
        },
        status: 'active'
      }
    ];
    
    // Add shuttles to database
    for (const shuttle of shuttles) {
      await addDoc(collection(db, 'shuttles'), shuttle);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};