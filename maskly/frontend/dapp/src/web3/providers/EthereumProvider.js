import Web3 from 'web3';

const EthereumProvider = () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        return web3;
    } else {
        console.error('No Ethereum provider detected');
        return null;
    }
};

export default EthereumProvider;

