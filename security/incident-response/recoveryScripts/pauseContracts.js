const Web3 = require('web3');
const { pauseContractABI } = require('../../tooling/codegen/typechain-config');

class ContractPauser {
    constructor(web3Provider, adminPrivateKey) {
        this.web3 = new Web3(web3Provider);
        this.adminAccount = this.web3.eth.accounts.privateKeyToAccount(adminPrivateKey);
        this.web3.eth.accounts.wallet.add(this.adminAccount);
    }

    /**
     * Pauses all critical contracts in emergency situations
     * @param {Array} contractAddresses - List of contract addresses to pause
     * @returns {Promise<void>}
     */
    async executePause(contractAddresses) {
        try {
            console.log('Initiating emergency contract pause...');
            
            for (const address of contractAddresses) {
                const contract = new this.web3.eth.Contract(pauseContractABI, address);
                
                // Check if contract is already paused
                const paused = await contract.methods.paused().call();
                if (paused) {
                    console.log(`Contract ${address} already paused`);
                    continue;
                }
                
                // Pause contract
                const gasPrice = await this.web3.eth.getGasPrice();
                const tx = contract.methods.pause();
                const [gasLimit, nonce] = await Promise.all([
                    tx.estimateGas({ from: this.adminAccount.address }),
                    this.web3.eth.getTransactionCount(this.adminAccount.address)
                ]);
                
                const txParams = {
                    to: address,
                    data: tx.encodeABI(),
                    gas: Math.floor(gasLimit * 1.2), // 20% buffer
                    gasPrice,
                    nonce,
                    chainId: await this.web3.eth.getChainId()
                };
                
                const signedTx = await this.web3.eth.accounts.signTransaction(txParams, this.adminAccount.privateKey);
                const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                
                console.log(`Paused contract at ${address}:`, receipt.transactionHash);
            }
            
            console.log('All contracts successfully paused');
        } catch (error) {
            console.error('Emergency pause failed:', error);
            throw error;
        }
    }
}

module.exports = ContractPauser;
