const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const LockContractABI = require('./LockContract.json');

class SolanaLockAdapter {
  constructor(contractAddress, providerUrl, options = {}) {
    this.connection = new Connection(providerUrl);
    this.contractAddress = new PublicKey(contractAddress);
    this.options = {
      commitment: 'confirmed',
      ...options
    };
  }

  async getRecentBlockhash() {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      throw new Error(`Failed to get recent blockhash: ${error.message}`);
    }
  }

  async createTransaction(instructions, signerPubkey) {
    try {
      const blockhash = await this.getRecentBlockhash();
      const transaction = new Transaction({
        feePayer: new PublicKey(signerPubkey),
        recentBlockhash: blockhash
      });

      instructions.forEach(instruction => transaction.add(instruction));
      return transaction;
    } catch (error) {
      throw new Error(`Transaction creation failed: ${error.message}`);
    }
  }

  async lockTokens(userPublicKey, amount) {
    if (!PublicKey.isOnCurve(new PublicKey(userPublicKey))) {
      throw new Error('Invalid Solana public key');
    }

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid lock amount');
    }

    try {
      const instructionData = Buffer.alloc(8);
      instructionData.writeBigInt64LE(BigInt(amount));

      const instruction = {
        keys: [
          { pubkey: new PublicKey(userPublicKey), isSigner: true, isWritable: true },
          { pubkey: this.contractAddress, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        programId: this.contractAddress,
        data: instructionData
      };

      const transaction = await this.createTransaction([instruction], userPublicKey);
      return transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      }).toString('base64');
    } catch (error) {
      throw new Error(`Lock tokens preparation failed: ${error.message}`);
    }
  }

  async unlockTokens(userPublicKey, amount) {
    if (!PublicKey.isOnCurve(new PublicKey(userPublicKey))) {
      throw new Error('Invalid Solana public key');
    }

    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid unlock amount');
    }

    try {
      const instructionData = Buffer.alloc(8);
      instructionData.writeBigInt64LE(BigInt(amount));

      const instruction = {
        keys: [
          { pubkey: new PublicKey(userPublicKey), isSigner: true, isWritable: true },
          { pubkey: this.contractAddress, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        programId: this.contractAddress,
        data: instructionData
      };

      const transaction = await this.createTransaction([instruction], userPublicKey);
      return transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      }).toString('base64');
    } catch (error) {
      throw new Error(`Unlock tokens preparation failed: ${error.message}`);
    }
  }

  async confirmTransaction(signature) {
    try {
      const confirmation = await this.connection.confirmTransaction(
        signature,
        this.options.commitment
      );
      return confirmation.value;
    } catch (error) {
      throw new Error(`Transaction confirmation failed: ${error.message}`);
    }
  }

  async getBalance(publicKey) {
    try {
      return this.connection.getBalance(new PublicKey(publicKey), this.options.commitment);
    } catch (error) {
      throw new Error(`Get balance failed: ${error.message}`);
    }
  }

  async listenForEvents(eventType) {
    try {
      const subscriptionId = this.connection.onLogs(this.contractAddress, (logs, context) => {
        if (logs.err) {
          console.error('Error in event logs:', logs.err);
        } else {
          console.log(`${eventType} event received:`, logs.logs);
        }
      }, this.options.commitment);

      return subscriptionId;
    } catch (error) {
      throw new Error(`Event listener setup failed: ${error.message}`);
    }
  }

  async estimateFee(transaction) {
    try {
      const fee = await this.connection.getFeeForMessage(
        transaction.compileMessage(),
        this.options.commitment
      );
      return fee.value;
    } catch (error) {
      throw new Error(`Fee estimation failed: ${error.message}`);
    }
  }
}

module.exports = SolanaLockAdapter;

