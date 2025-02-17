import React, { useState } from 'react';
import useContract from '../../hooks/useContract';

const LiquidityPool = () => {
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const contract = useContract('0xContractAddress', ['ABI']);

    const addLiquidity = async () => {
        try {
            await contract.addLiquidity(tokenA, tokenB, amountA, amountB);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Liquidity Pool</h2>
            <input type="text" placeholder="Token A Address" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            <input type="number" placeholder="Amount A" value={amountA} onChange={(e) => setAmountA(e.target.value)} />
            <input type="text" placeholder="Token B Address" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            <input type="number" placeholder="Amount B" value={amountB} onChange={(e) => setAmountB(e.target.value)} />
            <button onClick={addLiquidity}>Add Liquidity</button>
        </div>
    );
};

export default LiquidityPool;

