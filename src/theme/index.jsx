// Theme colors for Elevatio Flight Booking Website
const palette = [
  // Primary Blue (Main brand color)
  {
    name: 'primary',
    text: '#2563EB',
    bgColor: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue-600
    gradient: 'from-blue-600 to-blue-700',
  },
  
  // Secondary Purple (Accent color)
  {
    name: 'secondary', 
    text: '#9333EA',
    bgColor: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`, // Purple-600
    gradient: 'from-purple-600 to-purple-700',
  },
  
  // Primary Gradient (Blue to Purple - used in navbar)
  {
    name: 'primaryGradient',
    text: '#2563EB',
    bgColor: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    gradient: 'from-blue-600 to-purple-600',
    gradientHover: 'from-blue-700 to-purple-700',
  },
  
  // Sky Blue (Twitter-like)
  {
    name: 'sky',
    text: '#0EA5E9',
    bgColor: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`, // Sky-500
    gradient: 'from-sky-500 to-sky-600',
  },
  
  // Success Green
  {
    name: 'success',
    text: '#10B981',
    bgColor: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Emerald-500
    gradient: 'from-emerald-500 to-emerald-600',
  },
  
  // Warning Orange
  {
    name: 'warning',
    text: '#F59E0B',
    bgColor: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // Amber-500
    gradient: 'from-amber-500 to-orange-500',
  },
  
  // Instagram Gradient
  {
    name: 'instagram',
    text: '#E1306C',
    bgColor: (opacity = 1) => `rgba(225, 48, 108, ${opacity})`,
    gradient: 'from-purple-500 to-pink-500',
    gradientHover: 'from-purple-600 to-pink-600',
  },
  
  // Gray/Neutral (for backgrounds and text)
  {
    name: 'neutral',
    text: '#374151',
    bgColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // Gray-700
    lightBg: (opacity = 1) => `rgba(249, 250, 251, ${opacity})`, // Gray-50
    mediumBg: (opacity = 1) => `rgba(229, 231, 235, ${opacity})`, // Gray-200
  },
  
  // White with opacity control
  {
    name: 'white',
    text: '#FFFFFF',
    bgColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  },
  
  // Black with opacity control
  {
    name: 'black',
    text: '#000000',
    bgColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  },
  
  // LinkedIn Blue
  {
    name: 'linkedin',
    text: '#1D4ED8',
    bgColor: (opacity = 1) => `rgba(29, 78, 216, ${opacity})`, // Blue-700
    gradient: 'from-blue-700 to-blue-800',
  },
]

// Social media specific colors (used in HeaderContact)
export const socialColors = {
  facebook: {
    text: '#1877F2',
    bgColor: (opacity = 1) => `rgba(24, 119, 242, ${opacity})`,
    hover: (opacity = 1) => `rgba(24, 119, 242, ${opacity * 0.9})`,
  },
  twitter: {
    text: '#1DA1F2', 
    bgColor: (opacity = 1) => `rgba(29, 161, 242, ${opacity})`,
    hover: (opacity = 1) => `rgba(29, 161, 242, ${opacity * 0.9})`,
  },
  instagram: {
    text: '#E4405F',
    bgColor: (opacity = 1) => `rgba(228, 64, 95, ${opacity})`,
    gradient: 'from-purple-500 to-pink-500',
    gradientHover: 'from-purple-600 to-pink-600',
  },
  linkedin: {
    text: '#0077B5',
    bgColor: (opacity = 1) => `rgba(0, 119, 181, ${opacity})`,
    hover: (opacity = 1) => `rgba(0, 119, 181, ${opacity * 0.9})`,
  },
}

// Main theme export - defaults to primary colors
export const themeColors = {
  ...palette[0], // Default to primary blue
  all: palette,
  social: socialColors,
  
  // Quick access to commonly used colors
  primary: palette[0],
  secondary: palette[1], 
  gradient: palette[2],
  sky: palette[3],
  success: palette[4],
  warning: palette[5],
  neutral: palette[7],
  white: palette[8],
  black: palette[9],
}

// Utility function to get color by name
export const getColor = (colorName) => {
  return palette.find(color => color.name === colorName) || palette[0]
}

// Utility function for custom opacity
export const withOpacity = (hexColor, opacity) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default themeColors