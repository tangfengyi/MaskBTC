import axios from 'axios';

const API_URL = 'https://api.maskly.com/blockchain';

const validateInput = (input, type) => {
    if (type === 'id' && (!input || typeof input !== 'string' || input.length > 30720)) {
        throw new Error('Invalid blockchain ID');
    }
    if (type === 'transaction' && (!input || typeof input !== 'object')) {
        throw new Error('Invalid transaction data');
    }
};

export const fetchBlockchainData = async (blockchainId) => {
    try {
        validateInput(blockchainId, 'id');
        const response = await axios.get(`${API_URL}/${blockchainId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching blockchain data:', error);
        throw error;
    }
};

export const sendTransaction = async (transactionData) => {
    try {
        const response = await axios.post(`${API_URL}/transactions`, transactionData);
        return response.data;
    } catch (error) {
        console.error('Error sending transaction:', error);
        throw error;
    }
};

