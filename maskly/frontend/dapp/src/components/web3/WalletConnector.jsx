import React, { useEffect, useState } from 'react';
import useWallet from '../hooks/useWallet';

const WalletConnector = () => {
    const [chain, setChain] = useState('ethereum');
    const { account, connect } = useWallet();

    return (
        <div>
            <select value={chain} onChange={(e) => setChain(e.target.value)}>
                <option value="ethereum">Ethereum</option>
                <option value="solana">Solana</option>
            </select>
            <button onClick={() => connect(chain)}>Connect Wallet</button>
            {account && <p>Connected Account: {account}</p>}
        </div>
    );
};

export default WalletConnector;

