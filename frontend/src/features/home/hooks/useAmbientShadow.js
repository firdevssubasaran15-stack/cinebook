import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

/**
 * Custom hook to generate a subtle, mathematical breathing shadow effect.
 * Uses Animated API to interpolate shadow properties over time without tiring the eyes.
 * Isolates UI logic from the component (Single Responsibility Principle).
 */
export function useAmbientShadow(customColor) {
  const { colors: COLORS, isDark } = useTheme();
  
  // Create an animated value starting at 0
  const breathAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // A slow, 8-second total loop to create a peaceful 'breathing' depth effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false, // shadow properties require non-native driver
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        })
      ])
    ).start();
  }, [breathAnim]);

  // Interpolations based on theme (Dark vs Light mode)
  const shadowOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? [0.2, 0.4] : [0.1, 0.2]
  });

  const shadowRadius = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 16] // Grows softer and wider
  });

  const elevation = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 8] // For Android shadow compatibility
  });

  const animatedShadowStyle = {
    shadowColor: customColor || COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity,
    shadowRadius,
    elevation,
  };

  return { animatedShadowStyle };
}
