/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09101E',
          surface: '#121F3A',
          surfaceElevated: '#1A2C52',
          card: '#152445',
          border: '#233760',
          borderLight: '#2F487D',
        },
        light: {
          bg: '#FDFBF7',
          surface: '#FFFFFF',
          surfaceElevated: '#F5F2EA',
          card: '#FFFFFF',
          border: '#E2E0D5',
          borderLight: '#EBE8DF',
        },
        brand: {
          primary: '#1E3A8A',
          primaryLight: '#3B82F6',
          primaryDark: '#172554',
          secondary: '#D97706',
          accent: '#F59E0B',
        },
        text: {
          darkPrimary: '#FDFBF7',
          darkSecondary: '#C2C9D6',
          darkMuted: '#7685A0',
          lightPrimary: '#09101E',
          lightSecondary: '#3B4A6B',
          lightMuted: '#7685A0',
        },
        status: {
          success: '#4CAF82',
          error: '#FF5252',
          warning: '#FFB74D',
          info: '#64B5F6',
        }
      }
    },
  },
  plugins: [],
};
