import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

function Wallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        
        const ethBalance = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(ethBalance, 'ether'));
      }
    };
    
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h2>Wallet</h2>
      {account ? (
        <>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </>
      ) : (
        <p>Please connect to MetaMask</p>
      )}
    </div>
  );
}

export default Wallet;
