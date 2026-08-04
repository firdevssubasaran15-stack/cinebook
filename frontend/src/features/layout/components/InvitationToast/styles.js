import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8
  },
  titleText: {
    fontWeight: 'bold',
    flex: 1
  },
  descriptionText: {
    fontSize: 13,
    marginBottom: 12
  },
  boldText: {
    fontWeight: 'bold'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  rejectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  rejectButtonText: {
    fontWeight: '600'
  },
  acceptButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
