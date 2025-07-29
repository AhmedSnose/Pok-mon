// Environment configuration with validation and defaults
const DEFAULT_BASE_URL = 'https://pokeapi.co/api/v2';

export const config = {
  baseApiUrl: import.meta.env.VITE_BASE_API_URL || DEFAULT_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate the base URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Ensure the base URL is valid, fallback to default if not
if (!isValidUrl(config.baseApiUrl)) {
  console.warn(
    `Invalid VITE_BASE_API_URL: "${config.baseApiUrl}". Falling back to default: "${DEFAULT_BASE_URL}"`
  );
  config.baseApiUrl = DEFAULT_BASE_URL;
}

export default config;