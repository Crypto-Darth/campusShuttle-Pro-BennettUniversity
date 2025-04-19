// Export the Firebase instances
import { app, db, auth } from '../firebase';
export { app, db, auth };

// Export collection references
import { 
  busCollection, 
  routeCollection, 
  studentsCollection, 
  attendanceCollection 
} from './shuttleService';

export {
  busCollection,
  routeCollection,
  studentsCollection,
  attendanceCollection
};

// Export utility functions first
import { formatTimestamp } from './utils/dateUtils';
export { formatTimestamp };

// Then export the service functions
export { 
  initializeDatabase,
  getBusInfo,
  getRoute,
  subscribeToBusLocation,
  updateBusLocation,
  getAllBuses
} from './busService';

export {
  getRouteById,
  getAllRoutes
} from './routeService';

export {
  confirmAttendance,
  subscribeToAttendance,
  subscribeToAttendanceByBusId,
  debugAttendanceData
} from './attendanceService';