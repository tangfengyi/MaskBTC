const Web3 = require('web3');

class GasEstimator {
    constructor(providerUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }

    async estimateGas(transaction) {
        try {
            const gas = await this.web3.eth.estimateGas(transaction);
            return gas;
        } catch (error) {
            throw new Error(`Gas estimation failed: ${error.message}`);
        }
    }

    async getGasPrice() {
        try {
            const gasPrice = await this.web3.eth.getGasPrice();
            return gasPrice;
        } catch (error) {
            throw new Error(`Failed to get gas price: ${error.message}`);
        }
    }
}

module.exports = GasEstimator;

