import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

// Common styles shared across the app
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#4a80f5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
  },
  switchButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  switchButtonText: {
    color: 'white',
    fontSize: 12,
  },
  mapContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  webMapPlaceholder: {
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: '#e8eaed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  webMapNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  userMarker: {
    backgroundColor: '#4a80f5',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  busMarker: {
    backgroundColor: '#ff9500',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  collegeMarker: {
    backgroundColor: '#34c759',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#4a80f5',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});