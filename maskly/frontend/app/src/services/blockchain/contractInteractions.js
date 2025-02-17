import Web3 from 'web3';

class ContractInteractions {
    constructor(contractAddress, abi) {
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }

    validateInput(input, type) {
        if (type === 'address' && (!input || typeof input !== 'string' || !/^(0x)?[0-9a-fA-F]{40}$/.test(input))) {
            throw new Error('Invalid Ethereum address');
        }
        if (type === 'method' && typeof methodName !== 'string') {
            throw new Error('Invalid contract method name');
        }
    }

    async callContractMethod(methodName, ...args) {
        try {
            this.validateInput(methodName, 'method');
            const sanitizedArgs = args.map(arg => {
                if (typeof arg === 'string' && arg.startsWith('0x')) {
                    this.validateInput(arg, 'address');
                }
                return arg;
            });
            const method = this.contract.methods[methodName](...sanitizedArgs);
            const result = await method.call();
            return result;
        } catch (error) {
            console.error(`Error calling contract method ${methodName}:`, error);
            throw error;
        }
    }

    async sendTransaction(methodName, sender, ...args) {
        try {
            const method = this.contract.methods[methodName](...args);
            const gas = await method.estimateGas({ from: sender });
            const result = await method.send({ from: sender, gas });
            return result;
        } catch (error) {
            console.error(`Error sending transaction to contract method ${methodName}:`, error);
            throw error;
        }
    }
}

export default ContractInteractions;

