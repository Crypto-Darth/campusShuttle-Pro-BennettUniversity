import { getDocs, getDoc, doc } from 'firebase/firestore';
import { routeCollection } from './shuttleService';
import { db } from '../firebase';

/**
 * Get all routes
 */
export const getAllRoutes = async () => {
  try {
    const snapshot = await getDocs(routeCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all routes:", error);
    return [];
  }
};

/**
 * Get route by ID
 */
export const getRouteById = async (routeId) => {
  try {
    if (!routeId) return getMockRoute();
    
    const routeDoc = await getDoc(doc(db, 'routes', routeId));
    if (routeDoc.exists()) {
      return {
        id: routeDoc.id,
        ...routeDoc.data()
      };
    }
    return getMockRoute();
  } catch (error) {
    console.error(`Error getting route with ID ${routeId}:`, error);
    return getMockRoute();
  }
};

/**
 * Get the route info (first available)
 */
export const getRoute = async () => {
  try {
    const snapshot = await getDocs(routeCollection);
    if (snapshot.docs.length > 0) {
      // Return the first route
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

/**
 * Get mock route for development/fallback
 */
function getMockRoute() {
  return {
    id: "route1",
    name: 'Bennett University Route',
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
        students: 2
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