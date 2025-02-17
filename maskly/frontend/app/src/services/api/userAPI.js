import axios from 'axios';

const API_URL = 'https://api.maskly.com/users';

export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const validateUserData = (userData) => {
    for (const [key, value] of Object.entries(userData)) {
        if (typeof value !== 'string') {
            throw new Error(`Invalid data type for ${key}. Expected string.`);
        }
        if (value.length < 1 || value.length > 30720) {
            throw new Error(`${key} must be between 1 and 30720 characters`);
        }
    }
};

export const updateUserData = async (userId, userData) => {
    try {
        validateUserData(userData);
        const response = await axios.put(`${API_URL}/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

