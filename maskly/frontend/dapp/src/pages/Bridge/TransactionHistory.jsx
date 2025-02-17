import React, { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const contract = useContract('0xTransactionHistoryAddress', ['ABI']);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const txs = await contract.getPastTransactions();
                setTransactions(txs);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransactions();
    }, [contract]);

    return (
        <div>
            <h2>Transaction History</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>{tx}</li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;

