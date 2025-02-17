const ChainalysisAPI = require('chainalysis-api');

class AnomalyDetector {
    constructor(apiKey) {
        this.client = new ChainalysisAPI(apiKey);
    }

    /**
     * Detects anomalies in blockchain transactions
     * @param {string} chain - Blockchain network (e.g., 'ethereum', 'bitcoin')
     * @param {Array} transactions - Array of transaction hashes
     * @returns {Promise<Array>} - Array of suspicious transactions with risk scores
     */
    async detectAnomalies(chain, transactions) {
        try {
            const results = [];
            for (const tx of transactions) {
                const analysis = await this.client.getTransactionRisk(chain, tx);
                if (analysis.riskScore > 0.8) {
                    results.push({
                        transaction: tx,
                        riskScore: analysis.riskScore,
                        flags: analysis.flags
                    });
                }
            }
            return results;
        } catch (error) {
            console.error('Error during anomaly detection:', error);
            throw error;
        }
    }
}

module.exports = AnomalyDetector;
