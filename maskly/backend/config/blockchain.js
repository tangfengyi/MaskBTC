const Web3 = require('web3');

const ethereumProvider = process.env.ETHEREUM_PROVIDER_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const solanaProvider = process.env.SOLANA_PROVIDER_URL || 'https://api.mainnet-beta.solana.com';

const ethereumWeb3 = new Web3(new Web3.providers.HttpProvider(ethereumProvider));
const solanaConnection = new (require('@solana/web3.js').Connection)(solanaProvider, 'confirmed');

module.exports = {
    ethereum: {
        web3: ethereumWeb3,
        providerUrl: ethereumProvider
    },
    solana: {
        connection: solanaConnection,
        providerUrl: solanaProvider
    }
};


