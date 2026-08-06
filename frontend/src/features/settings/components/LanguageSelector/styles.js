import { StyleSheet } from 'react-native';

export const getLanguageSelectorStyles = (COLORS) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  flagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: COLORS.background,
  },
  flagButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceElevated,
  },
  flagText: {
    fontSize: 24,
  }
});
