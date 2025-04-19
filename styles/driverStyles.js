import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export const driverStyles = StyleSheet.create({
  header: {
    backgroundColor: '#34c759',
  },
  busInfo: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  busStatus: {
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  driverMarker: {
    backgroundColor: '#34c759',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopMarker: {
    backgroundColor: '#ff9500',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCount: {
    position: 'absolute',
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4a80f5',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  activeTabText: {
    color: '#4a80f5',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  routeContent: {
    padding: 15,
  },
  routeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4a80f5',
  },
  stopMarkerSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stopNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stopAddress: {
    fontSize: 14,
    color: '#666',
  },
  stopTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: 5,
  },
  stopStudents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a80f5',
    marginLeft: 5,
  },
  studentsContent: {
    padding: 15,
  },
  studentsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studentsDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stopStudentsSection: {
    marginBottom: 20,
  },
  stopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  stopHeaderTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  stopHeaderCount: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a80f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  studentConfirmed: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  webMapIconsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    justifyContent: 'space-around',
    width: '60%',
  },
  webMapIcon: {
    alignItems: 'center',
  },
  webMapIconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  debugBox: {
    padding: 10, 
    backgroundColor: '#f8f8f8', 
    marginBottom: 10, 
    borderRadius: 5
  },
  debugText: {
    fontSize: 12, 
    color: '#666'
  }
});