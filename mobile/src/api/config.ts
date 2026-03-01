// API Configuration - Same backend as web app!
// Note: iOS requires HTTPS, but Elastic Beanstalk HTTP should work in simulator
// If it doesn't, we'll need to configure App Transport Security or use HTTPS
export const API_BASE_URL = 'http://Bandz-env.eba-mncqqwp8.us-east-2.elasticbeanstalk.com';

// Default headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Practice-Id': '1',
};

// Helper function for API calls
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log(`[API] Fetching: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Note: Timeout handled by fetch defaults
    });

    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response: ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[API] Success: ${endpoint}`);
    return data;
  } catch (error: any) {
    // Log the actual error for debugging
    console.error(`[API] Request failed for ${endpoint}:`, error.message || error);
    
    // Re-throw with more context
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      throw new Error('Network request failed. Make sure the backend is accessible and you have internet connection.');
    }
    if (error.name === 'AbortError') {
      throw new Error('Request cancelled.');
    }
    throw error;
  }
}
