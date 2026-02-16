const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    PREDICT: `${API_BASE_URL}/predict`,
    HEALTH: `${API_BASE_URL}/health`,
    CHAT: `${API_BASE_URL}/chat` // Assuming chat endpoint follows same pattern
};

export default API_BASE_URL;
