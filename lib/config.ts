// lib/config.ts
// Centralized configuration for API URLs and environment variables

export const config = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  
  // Environment
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  
  // Other configs can be added here
  UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
};

// Helper functions
export const getApiUrl = (endpoint: string) => `${config.API_BASE_URL}${endpoint}`;
export const getSocketUrl = () => config.SOCKET_URL; 