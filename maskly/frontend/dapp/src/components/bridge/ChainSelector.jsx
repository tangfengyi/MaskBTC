import React, { useState } from 'react';

const ChainSelector = ({ label, onSelect }) => {
    const [selectedChain, setSelectedChain] = useState('');

    return (
        <div>
            <label>{label}</label>
            <select value={selectedChain} onChange={(e) => {
                setSelectedChain(e.target.value);
                onSelect(e.target.value);
            }}>
                <option value="">Select a chain</option>
                <option value="ethereum">Ethereum</option>
                <option value="solana">Solana</option>
                <option value="binance">Binance</option>
            </select>
        </div>
    );
};

export default ChainSelector;

