import { useMemo } from 'react';
import { CONTENT_COLOR_STRATEGIES } from '../constants/colorStrategies';

/**
 * Custom hook to calculate content-specific color palettes and gradients.
 * Uses strategy pattern to resolve the base color for the content type,
 * and mathematical ratios based on likes/dislikes to calculate opacity.
 * 
 * @param {string} contentType - The type of content ('movie', 'series', 'book')
 * @param {number} likes - Number of likes
 * @param {number} dislikes - Number of dislikes
 * @returns {Object} { gradientColors, themeColor }
 */
export function useContentColorPalette(contentType, likes = 0, dislikes = 0) {
  const palette = useMemo(() => {
    // 1. Resolve Strategy
    const strategy = CONTENT_COLOR_STRATEGIES[contentType] || CONTENT_COLOR_STRATEGIES.default;
    
    // 2. Math & Logic for Intensity based on Likes/Dislikes
    const total = likes + dislikes;
    let opacityStart = 0.15; // Increased baseline so colors are actually visible
    let endColor = `rgba(${strategy.rgb}, 0.05)`;
    
    if (total > 0) {
      const score = (likes - dislikes) / total;
      // High score -> High glow
      opacityStart = 0.15 + (Math.abs(score) * 0.25); // ranges from 0.15 to 0.40
      
      if (score > 0) {
        // Liked -> fade into subtle Emerald Green
        endColor = `rgba(16, 185, 129, ${0.10 + (score * 0.20)})`; 
      } else if (score < 0) {
        // Disliked -> fade into subtle Crimson Red
        endColor = `rgba(220, 38, 38, ${0.10 + (Math.abs(score) * 0.20)})`;
      }
    }
    
    // 3. Construct Gradient Colors
    // Start with the Content Type color, fade into the Engagement (Like/Dislike) color
    const gradientColors = [`rgba(${strategy.rgb}, ${opacityStart})`, endColor];

    return {
      gradientColors,
      themeColor: strategy.themeColor,
      iconColor: strategy.iconColor,
      strategyName: contentType // useful for debugging or UI decisions
    };
  }, [contentType, likes, dislikes]);

  return palette;
}
