const Web3 = require('web3');
const PoolContractABI = require('./PoolContract.json');

class PoolManager {
  constructor(contractAddress, providerUrl) {
    this.web3 = new Web3(providerUrl);
    this.contract = new this.web3.eth.Contract(PoolContractABI, contractAddress);
  }

  async getReserves() {
    const reserves = await this.contract.methods.getReserves().call();
    return {
      reserveA: this.web3.utils.toBN(reserves[0]),
      reserveB: this.web3.utils.toBN(reserves[1])
    };
  }

  getPrice(isAToB) {
    return async () => {
      const { reserveA, reserveB } = await this.getReserves();
      return isAToB 
        ? reserveB.mul(this.web3.utils.toBN(1e18)).div(reserveA)
        : reserveA.mul(this.web3.utils.toBN(1e18)).div(reserveB);
    };
  }

  async addLiquidity(userAddress, amountA, amountB) {
    if (!this.web3.utils.isAddress(userAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    if (typeof amountA !== 'number' || amountA <= 0 ||
        typeof amountB !== 'number' || amountB <= 0) {
      throw new Error('Invalid liquidity amounts');
    }

    try {
      const tx = this.contract.methods.addLiquidity(amountA, amountB);
      const [gas, gasPrice] = await Promise.all([
        tx.estimateGas({ from: userAddress }),
        this.web3.eth.getGasPrice()
      ]);
      return {
        to: this.contract._address,
        data: tx.encodeABI(),
        gas,
        gasPrice
      };
    } catch (error) {
      throw new Error(`Add liquidity failed: ${error.message}`);
    }
  }

  async removeLiquidity(userAddress, liquidityAmount) {
    try {
      const tx = this.contract.methods.removeLiquidity(liquidityAmount);
      const [gas, gasPrice] = await Promise.all([
        tx.estimateGas({ from: userAddress }),
        this.web3.eth.getGasPrice()
      ]);
      return {
        to: this.contract._address,
        data: tx.encodeABI(),
        gas,
        gasPrice
      };
    } catch (error) {
      throw new Error(`Remove liquidity failed: ${error.message}`);
    }
  }

  async swap(userAddress, amountIn, isAToB) {
    try {
      const method = isAToB ? 'swapAforB' : 'swapBforA';
      const tx = this.contract.methods[method](amountIn);
      const [gas, gasPrice] = await Promise.all([
        tx.estimateGas({ from: userAddress }),
        this.web3.eth.getGasPrice()
      ]);
      return {
        to: this.contract._address,
        data: tx.encodeABI(),
        gas,
        gasPrice
      };
    } catch (error) {
      throw new Error(`Swap failed: ${error.message}`);
    }
  }

  async getLiquidityBalance(userAddress) {
    try {
      return this.contract.methods.liquidityBalances(userAddress).call();
    } catch (error) {
      throw new Error(`Get liquidity balance failed: ${error.message}`);
    }
  }

  async getAmountOut(amountIn, isAToB) {
    try {
      return this.contract.methods.getAmountOut(amountIn, isAToB).call();
    } catch (error) {
      throw new Error(`Get amount out failed: ${error.message}`);
    }
  }
}

module.exports = PoolManager;

