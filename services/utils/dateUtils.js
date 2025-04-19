/**
 * Safely format a Firestore timestamp
 */
export function formatTimestamp(timestamp) {
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
};