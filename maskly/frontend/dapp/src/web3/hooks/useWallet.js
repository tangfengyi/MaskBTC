import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useWallet = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const initWallet = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } else {
                console.error('No Ethereum provider detected');
            }
        };

        initWallet();
    }, []);

    return account;
};

export default useWallet;

