const axios = require('axios');

class TransactionRelay {
    /**
     * @param {string[]} apiEndpoints - List of blockchain node endpoints.
     * @param {number} maxRetries - Maximum number of retries for failed requests.
     */
    constructor(apiEndpoints, maxRetries = 3) {
        this.apiEndpoints = apiEndpoints;
        this.maxRetries = maxRetries;
    }

    /**
     * Relays a transaction to multiple blockchain nodes with retry logic.
     * @param {Object} transactionData - The transaction data to relay.
     * @returns {Promise<Object[]>} Responses from successful transactions.
     */
    async relayTransaction(transactionData) {
        const results = [];
        const errors = [];

        // Randomly select a subset of endpoints to optimize performance
        const selectedEndpoints = this._selectRandomEndpoints(this.apiEndpoints, 3);

        for (const endpoint of selectedEndpoints) {
            let attempts = 0;
            let success = false;

            while (attempts < this.maxRetries && !success) {
                try {
                    const response = await axios.post(endpoint, transactionData);
                    results.push(response.data);
                    success = true;
                } catch (error) {
                    attempts++;
                    errors.push({ endpoint, attempt: attempts, error });

                    if (attempts === this.maxRetries) {
                        console.error(`Failed to relay transaction to ${endpoint} after ${this.maxRetries} attempts`, error);
                    }
                }
            }
        }

        if (errors.length > 0) {
            console.warn('Some transactions failed. Details:', errors);
        }

        return results;
    }

    /**
     * Selects a random subset of endpoints.
     * @param {string[]} endpoints - The full list of endpoints.
     * @param {number} count - The number of endpoints to select.
     * @returns {string[]} The selected endpoints.
     */
    _selectRandomEndpoints(endpoints, count) {
        const shuffled = endpoints.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

module.exports = TransactionRelay;

