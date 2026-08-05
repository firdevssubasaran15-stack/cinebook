/**
 * Strategy pattern for applying colors based on content type.
 * This separates the configuration from the logic (Open/Closed Principle).
 * 
 * Each strategy defines an RGB tuple (string format) that can be easily
 * combined with an alpha value to create dynamic opacity gradients.
 */

export const CONTENT_COLOR_STRATEGIES = {
  movie: {
    // Elegant Amber/Gold for Movies (Cinema/Awards)
    rgb: '245, 158, 11', // rgb(245, 158, 11)
    themeColor: '#f59e0b',
    iconColor: '#fbbf24'
  },
  series: {
    // Elegant Sky Blue for Series (Television/Screens)
    rgb: '14, 165, 233', // rgb(14, 165, 233)
    themeColor: '#0ea5e9',
    iconColor: '#38bdf8'
  },
  book: {
    // Elegant Violet for Books (Imagination/Fantasy)
    rgb: '139, 92, 246', // rgb(139, 92, 246)
    themeColor: '#8b5cf6',
    iconColor: '#a78bfa'
  },
  default: {
    // Elegant Grayscale for Default
    rgb: '156, 163, 175', // rgb(156, 163, 175)
    themeColor: '#9ca3af',
    iconColor: '#d1d5db'
  }
};
