import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useContract = (address, abi) => {
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                const instance = new web3.eth.Contract(abi, address);
                setContract(instance);
            } else {
                console.error('No Ethereum provider detected');
            }
        };

        initContract();
    }, [address, abi]);

    return contract;
};

export default useContract;

