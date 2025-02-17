const Web3 = require('web3');

class NonceManager {
    constructor(providerUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        this.nonces = {};
    }

    async getNonce(address, chainId) {
        const key = `${address}:${chainId}`;
        if (!this.nonces[key]) {
            this.nonces[key] = await this.web3.eth.getTransactionCount(address, 'pending');
        }
        return this.nonces[key];
    }

    incrementNonce(address, chainId) {
        const key = `${address}:${chainId}`;
        if (this.nonces[key] !== undefined) {
            this.nonces[key] += 1;
        } else {
            throw new Error(`Nonce for address ${address} on chain ${chainId} has not been initialized`);
        }
    }
}

module.exports = NonceManager;

