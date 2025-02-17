import React, { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';

const BridgeProgress = () => {
    const [progress, setProgress] = useState(0);
    const contract = useContract('0xBridgeAddress', ['ABI']);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const status = await contract.getStatus();
                setProgress(status.progress);
            } catch (error) {
                console.error(error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [contract]);

    return (
        <div>
            <h2>Bridge Progress</h2>
            <progress value={progress} max="100"></progress>
            <p>{progress}% Complete</p>
        </div>
    );
};

export default BridgeProgress;

