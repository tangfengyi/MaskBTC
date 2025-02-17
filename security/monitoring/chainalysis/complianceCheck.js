const ChainalysisAPI = require('chainalysis-api');

class ComplianceChecker {
    constructor(apiKey) {
        this.client = new ChainalysisAPI(apiKey);
    }

    /**
     * Performs compliance checks on blockchain addresses
     * @param {string} chain - Blockchain network (e.g., 'ethereum', 'bitcoin')
     * @param {Array} addresses - Array of wallet addresses to check
     * @returns {Promise<Array>} - Array of non-compliant addresses with details
     */
    async checkCompliance(chain, addresses) {
        try {
            const results = [];
            for (const address of addresses) {
                const complianceStatus = await this.client.getAddressCompliance(chain, address);
                if (!complianceStatus.isCompliant) {
                    results.push({
                        address: address,
                        complianceStatus: complianceStatus.status,
                        reasons: complianceStatus.reasons
                    });
                }
            }
            return results;
        } catch (error) {
            console.error('Error during compliance check:', error);
            throw error;
        }
    }
}

module.exports = ComplianceChecker;
