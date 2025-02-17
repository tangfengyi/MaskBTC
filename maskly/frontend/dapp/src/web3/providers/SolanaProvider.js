import { Connection, clusterApiUrl } from '@solana/web3.js';

const SolanaProvider = () => {
    const network = 'devnet';
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    return connection;
};

export default SolanaProvider;

