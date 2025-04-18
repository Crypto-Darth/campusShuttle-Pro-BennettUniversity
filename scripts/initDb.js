const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Keep your existing Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCWWr-A6HP34eRkoHiOKEuOZ-Qbmpkyamo",
    authDomain: "campusproshuttlelite.firebaseapp.com",
    projectId: "campusproshuttlelite",
    storageBucket: "campusproshuttlelite.firebasestorage.app",
    messagingSenderId: "153847249312",
    appId: "1:153847249312:web:eb685180201fa702844cc5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update the seed function for a single bus and route
async function seedDatabase() {
  try {
    // Add the campus route
    console.log('Adding route to database...');
    const route = {
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

    const routeRef = await addDoc(collection(db, 'route'), route);
    console.log(`Route added with ID: ${routeRef.id}`);
    
    // Add the campus bus
    console.log('Adding bus to database...');
    const bus = {
      name: 'Campus Bus',
      driverId: 'driver1',
      routeId: routeRef.id,
      capacity: 20,
      location: {
        latitude: 37.78825,
        longitude: -122.4324
      },
      status: 'active',
      eta: '5 min'
    };
    
    const busRef = await addDoc(collection(db, 'bus'), bus);
    console.log(`Bus added with ID: ${busRef.id}`);
    
    console.log('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Database initialization completed');
    process.exit(0); // Exit successfully
  })
  .catch(error => {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit with error
  });