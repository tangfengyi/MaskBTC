const Web3 = require('web3');
const LockContractABI = require('./LockContract.json');

class EthereumLockAdapter {
  constructor(contractAddress, providerUrl, options = {}) {
    this.web3 = new Web3(providerUrl);
    this.contract = new this.web3.eth.Contract(LockContractABI, contractAddress);
    this.options = {
      gasLimitBuffer: 0.2, // 20% buffer
      ...options
    };
  }

  async getTransactionOptions(userAddress, method, value = '0') {
    if (!this.web3.utils.isAddress(userAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    const weiValue = this.web3.utils.toWei(value.toString(), 'ether');

    try {
      const [gas, gasPrice] = await Promise.all([
        method.estimateGas({ from: userAddress, value: weiValue }),
        this.web3.eth.getGasPrice()
      ]);

      return {
        to: this.contract._address,
        data: method.encodeABI(),
        gas: Math.floor(gas * (1 + this.options.gasLimitBuffer)),
        gasPrice
      };
    } catch (error) {
      throw new Error(`Transaction preparation failed: ${error.message}`);
    }
  }

  async lockTokens(userAddress, amount) {
    try {
      const method = this.contract.methods.lockTokens(amount);
      return this.getTransactionOptions(userAddress, method);
    } catch (error) {
      throw new Error(`Lock tokens preparation failed: ${error.message}`);
    }
  }

  async unlockTokens(userAddress, amount) {
    try {
      const method = this.contract.methods.unlockTokens(userAddress, amount);
      return this.getTransactionOptions(userAddress, method);
    } catch (error) {
      throw new Error(`Unlock tokens preparation failed: ${error.message}`);
    }
  }

  async getLockedBalance(userAddress) {
    try {
      return this.contract.methods.getLockedBalance(userAddress).call();
    } catch (error) {
      throw new Error(`Get locked balance failed: ${error.message}`);
    }
  }

  async getUnlockTime(userAddress) {
    try {
      return this.contract.methods.unlockTime(userAddress).call();
    } catch (error) {
      throw new Error(`Get unlock time failed: ${error.message}`);
    }
  }

  async listenForLockEvents(fromBlock = 'latest') {
    return new Promise((resolve, reject) => {
      this.contract.events.TokensLocked({ fromBlock })
        .on('data', resolve)
        .on('error', reject);
    });
  }

  async listenForUnlockEvents(fromBlock = 'latest') {
    return new Promise((resolve, reject) => {
      this.contract.events.TokensUnlocked({ fromBlock })
        .on('data', resolve)
        .on('error', reject);
    });
  }
}

module.exports = EthereumLockAdapter;

