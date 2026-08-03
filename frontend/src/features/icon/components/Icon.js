import React from 'react';
import * as PhosphorIcons from 'phosphor-react-native';

/**
 * Icon component that wraps phosphor-react-native.
 * Follows the Dependency Inversion Principle (SOLID) by providing
 * an abstraction layer so the rest of the application is not tightly
 * coupled to the underlying icon library implementation.
 * 
 * @param {string} name - The exact name of the Phosphor icon component (e.g., 'House', 'FilmStrip').
 * @param {number} size - Size of the icon. Default is 24.
 * @param {string} color - Color of the icon. Default is '#000000'.
 * @param {string} weight - Weight of the icon ('regular', 'fill', 'bold', 'light', 'duotone', 'thin'). Default is 'regular'.
 * @returns React Component
 */
export default function Icon({ name, size = 24, color = '#000000', weight = 'regular', style, ...rest }) {
  const IconComponent = PhosphorIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist in phosphor-react-native.`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      weight={weight}
      style={style}
      {...rest}
    />
  );
}
