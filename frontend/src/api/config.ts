// API Configuration
export const API_BASE_URL = 'http://localhost:3001';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Practice-Id': '1', // Default practice ID
};

// Helper function for API calls
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
