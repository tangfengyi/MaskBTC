require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./maskly/blockchain/contracts",
    tests: "./tests",
    scripts: "./scripts"
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // mainnet: {
    //   url: process.env.MAINNET_RPC_URL,
    //   accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    //   gasPrice: 50000000000, // 50 Gwei
    //   gasMultiplier: 1.2
    // }
  }
};
