import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TransactionToast = ({ transactionHash }) => {
    useEffect(() => {
        if (transactionHash) {
            toast.success(`Transaction successful: ${transactionHash}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [transactionHash]);

    return null;
};

export default TransactionToast;

