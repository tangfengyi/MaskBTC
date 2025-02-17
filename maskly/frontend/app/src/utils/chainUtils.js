class ChainUtils {
    constructor(web3Instances) {
        this.web3Instances = web3Instances;
    }

    async getChainId(chainName) {
        const web3 = this.web3Instances[chainName];
        if (!web3) throw new Error(`No Web3 instance found for chain: ${chainName}`);
        return await web3.eth.getChainId();
    }

    async switchChain(chainName) {
        const web3 = this.web3Instances[chainName];
        if (!web3) throw new Error(`No Web3 instance found for chain: ${chainName}`);
        // Logic to switch chains
        console.log(`Switched to chain: ${chainName}`);
    }
}

module.exports = ChainUtils;

