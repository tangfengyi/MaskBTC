import React from 'react';
import './styles/App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WalletConnector from './components/web3/WalletConnector';
import TransactionToast from './components/web3/TransactionToast';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to MASKLY DApp</h1>
        <p>Decentralized Application for MASKLY project</p>
        <LoginForm />
        <RegisterForm />
        <WalletConnector />
      </header>
      <TransactionToast />
    </div>
  );
}

export default App;

