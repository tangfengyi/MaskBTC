import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoChat from './pages/VideoChat';
import Wallet from './pages/Wallet';
import Account from './pages/Account';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/video" element={<VideoChat />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
