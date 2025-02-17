// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSig is Ownable {
    struct Transaction {
        uint256 id;
        address to;
        uint256 value;
        bytes data;
        uint256 confirmations;
        bool executed;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    uint256 public requiredConfirmations;
    uint256 public transactionCount;

    event TransactionCreated(uint256 indexed txId, address indexed to, uint256 value, bytes data);
    event TransactionConfirmed(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId);

    constructor(uint256 _requiredConfirmations) {
        require(_requiredConfirmations > 0, "Required confirmations must be greater than 0");
        requiredConfirmations = _requiredConfirmations;
    }

    function createTransaction(address to, uint256 value, bytes memory data) public onlyOwner returns (uint256) {
        uint256 txId = transactionCount;
        transactions[txId] = Transaction({
            id: txId,
            to: to,
            value: value,
            data: data,
            confirmations: 0,
            executed: false
        });
        transactionCount++;
        emit TransactionCreated(txId, to, value, data);
        return txId;
    }

    function confirmTransaction(uint256 txId) public onlyOwner {
        require(!transactions[txId].executed, "Transaction already executed");
        require(!confirmations[txId][msg.sender], "Already confirmed");

        confirmations[txId][msg.sender] = true;
        transactions[txId].confirmations++;

        emit TransactionConfirmed(txId, msg.sender);

        if (transactions[txId].confirmations >= requiredConfirmations) {
            executeTransaction(txId);
        }
    }

    function executeTransaction(uint256 txId) internal {
        require(transactions[txId].confirmations >= requiredConfirmations, "Not enough confirmations");
        require(!transactions[txId].executed, "Transaction already executed");

        Transaction storage transaction = transactions[txId];
        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction execution failed");

        emit TransactionExecuted(txId);
    }
}

