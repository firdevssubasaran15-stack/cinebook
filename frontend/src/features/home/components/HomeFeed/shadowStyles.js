import { StyleSheet } from 'react-native';

/**
 * Structural styles for the ambient shadow container.
 * Extracted here to maintain cleanly separated style logic.
 */
export const shadowStyles = StyleSheet.create({
  ambientContainer: {
    marginHorizontal: 16, // Matches tailwind px-4 from styles.container if needed, or we just wrap it
    borderRadius: 24, // High radius to ensure the glow smoothly wraps around the content
    backgroundColor: 'transparent', // Let inner items handle their own background
    // A slight bottom margin to give the shadow room to breathe
    marginBottom: 8,
  }
});
