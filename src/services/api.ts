// API Service for MoMasry Fitness Assessment System
// Handles all communication with the backend API

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

// Types for API responses
export interface Client {
  id: string;
  name: string;
  age: number;
  height: number;
  starting_weight: number;
  gender: 'male' | 'female';
  marital_status: 'single' | 'married' | 'divorced';
  training_level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  injury_history: string;
  smoking: boolean;
  alcohol: boolean;
  sleep_hours: number;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  client_id: string;
  session_date: string;
  pain_level: number;
  sleep_quality: number;
  general_condition: string;
  weight: number;
  body_fat: number;
  muscle_mass: number;
  waist: number;
  hips: number;
  chest: number;
  thigh: number;
  arm: number;
  calf?: number;
  shoulders?: number;
  photo_front: string;
  photo_side: string;
  photo_back: string;
  created_at: string;
  updated_at: string;
}

export interface MobilityTest {
  id: string;
  session_id: string;
  category: 'hip' | 'shoulder' | 'ankle' | 'thoracic';
  exercise_name: string;
  exercise_description: string;
  result: number;
  notes?: string;
  created_at: string;
}

export interface StabilityTest {
  id: string;
  session_id: string;
  exercise_name: string;
  exercise_description: string;
  result: string;
  notes?: string;
  created_at: string;
}

export interface StrengthTest {
  id: string;
  session_id: string;
  category: 'push' | 'pull' | 'lower' | 'core';
  exercise_name: string;
  exercise_description: string;
  weight: number;
  reps: number;
  notes?: string;
  created_at: string;
}

export interface StrengthBenchmark {
  id: string;
  session_id: string;
  exercise: 'push-up' | 'pull-up' | 'bench-press' | 'squat' | 'deadlift' | 'military-press';
  weight: number;
  reps: number;
  score: number;
  created_at: string;
}

// Generic API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// =====================================================
// CLIENTS API
// =====================================================

export const clientsApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    return apiRequest('/clients');
  },

  // Get client by ID
  getById: async (id: string): Promise<Client> => {
    return apiRequest(`/clients/${id}`);
  },

  // Create new client
  create: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  // Update client
  update: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    return apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    return apiRequest(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// =====================================================
// SESSIONS API
// =====================================================

export const sessionsApi = {
  // Get all sessions (optionally filtered by client)
  getAll: async (clientId?: string): Promise<Session[]> => {
    const query = clientId ? `?clientId=${clientId}` : '';
    return apiRequest(`/sessions${query}`);
  },

  // Get session by ID
  getById: async (id: string): Promise<Session> => {
    return apiRequest(`/sessions/${id}`);
  },

  // Create new session
  create: async (sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'>): Promise<Session> => {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Update session
  update: async (id: string, sessionData: Partial<Session>): Promise<Session> => {
    return apiRequest(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  },

  // Delete session
  delete: async (id: string): Promise<void> => {
    return apiRequest(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// =====================================================
// MOBILITY TESTS API
// =====================================================

export const mobilityApi = {
  // Get mobility tests for a session
  getBySession: async (sessionId: string): Promise<MobilityTest[]> => {
    return apiRequest(`/sessions/${sessionId}/mobility`);
  },

  // Save mobility tests for a session
  saveForSession: async (sessionId: string, tests: Omit<MobilityTest, 'id' | 'session_id' | 'created_at'>[]): Promise<MobilityTest[]> => {
    return apiRequest(`/sessions/${sessionId}/mobility`, {
      method: 'POST',
      body: JSON.stringify({ tests }),
    });
  },
};

// =====================================================
// STABILITY TESTS API
// =====================================================

export const stabilityApi = {
  // Get stability tests for a session
  getBySession: async (sessionId: string): Promise<StabilityTest[]> => {
    return apiRequest(`/sessions/${sessionId}/stability`);
  },

  // Save stability tests for a session
  saveForSession: async (sessionId: string, tests: Omit<StabilityTest, 'id' | 'session_id' | 'created_at'>[]): Promise<StabilityTest[]> => {
    return apiRequest(`/sessions/${sessionId}/stability`, {
      method: 'POST',
      body: JSON.stringify({ tests }),
    });
  },
};

// =====================================================
// STRENGTH TESTS API
// =====================================================

export const strengthApi = {
  // Get strength tests for a session
  getBySession: async (sessionId: string): Promise<StrengthTest[]> => {
    return apiRequest(`/sessions/${sessionId}/strength`);
  },

  // Save strength tests for a session
  saveForSession: async (sessionId: string, tests: Omit<StrengthTest, 'id' | 'session_id' | 'created_at'>[]): Promise<StrengthTest[]> => {
    return apiRequest(`/sessions/${sessionId}/strength`, {
      method: 'POST',
      body: JSON.stringify({ tests }),
    });
  },
};

// =====================================================
// STRENGTH BENCHMARKS API
// =====================================================

export const benchmarksApi = {
  // Get benchmarks for a session
  getBySession: async (sessionId: string): Promise<StrengthBenchmark[]> => {
    return apiRequest(`/sessions/${sessionId}/benchmarks`);
  },

  // Save benchmarks for a session
  saveForSession: async (sessionId: string, benchmarks: Omit<StrengthBenchmark, 'id' | 'session_id' | 'created_at'>[]): Promise<StrengthBenchmark[]> => {
    return apiRequest(`/sessions/${sessionId}/benchmarks`, {
      method: 'POST',
      body: JSON.stringify({ benchmarks }),
    });
  },
};

// =====================================================
// ANALYTICS API
// =====================================================

export const analyticsApi = {
  // Get client analytics data
  getClientAnalytics: async (clientId: string, metric: string = 'weight'): Promise<any[]> => {
    return apiRequest(`/clients/${clientId}/analytics?metric=${metric}`);
  },
};

// =====================================================
// HEALTH CHECK API
// =====================================================

export const healthApi = {
  // Check API health
  check: async (): Promise<{ status: string; database: string; timestamp: string }> => {
    return apiRequest('/health');
  },
};

// =====================================================
// ERROR HANDLING
// =====================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper to handle API errors in components
export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Export all APIs as a single object for convenience
export const api = {
  clients: clientsApi,
  sessions: sessionsApi,
  mobility: mobilityApi,
  stability: stabilityApi,
  strength: strengthApi,
  benchmarks: benchmarksApi,
  analytics: analyticsApi,
  health: healthApi,
};
