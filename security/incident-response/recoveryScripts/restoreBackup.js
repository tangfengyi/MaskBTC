const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class BackupRestorer {
    constructor(backupDirectory, encryptionKey) {
        this.backupDirectory = backupDirectory;
        this.encryptionKey = encryptionKey;
        this.backupManifest = {};
    }

    /**
     * Loads and verifies backup manifest
     */
    loadManifest() {
        try {
            const manifestPath = path.join(this.backupDirectory, 'manifest.json');
            const manifestData = fs.readFileSync(manifestPath, 'utf8');
            this.backupManifest = JSON.parse(manifestData);
            
            // Verify manifest integrity
            const checksum = crypto.createHash('sha256').update(manifestData).digest('hex');
            if (checksum !== this.backupManifest.checksum) {
                throw new Error('Manifest checksum verification failed');
            }
            
            console.log('Backup manifest loaded and verified');
        } catch (error) {
            console.error('Failed to load backup manifest:', error);
            throw error;
        }
    }

    /**
     * Restores all system components from backup
     */
    async restoreSystem() {
        try {
            console.log('Initiating system restoration...');
            this.loadManifest();
            
            for (const [component, details] of Object.entries(this.backupManifest.components)) {
                await this.restoreComponent(component, details);
            }
            
            console.log('All components restored successfully');
        } catch (error) {
            console.error('System restoration failed:', error);
            throw error;
        }
    }

    /**
     * Restores individual component
     * @param {string} componentName - Name of the component to restore
     * @param {Object} details - Component backup details
     */
    async restoreComponent(componentName, details) {
        try {
            console.log(`Restoring ${componentName}...`);
            
            // Verify backup file integrity
            const backupFilePath = path.join(this.backupDirectory, details.filename);
            const fileBuffer = fs.readFileSync(backupFilePath);
            const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            
            if (hash !== details.checksum) {
                throw new Error(`Checksum mismatch for ${componentName}`);
            }
            
            // Decrypt backup file
            const decryptedData = this.decryptFile(fileBuffer);
            
            // Restore based on component type
            switch(details.type) {
                case 'database':
                    await this.restoreDatabase(componentName, decryptedData);
                    break;
                case 'filesystem':
                    await this.restoreFileSystem(componentName, decryptedData);
                    break;
                case 'smart-contract':
                    await this.restoreSmartContract(componentName, decryptedData);
                    break;
                default:
                    throw new Error(`Unknown component type: ${details.type}`);
            }
            
            console.log(`${componentName} restored successfully`);
        } catch (error) {
            console.error(`Failed to restore ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * Decrypts backup file using AES-256-GCM
     * @param {Buffer} encryptedData - Encrypted file data
     * @returns {string} Decrypted content
     */
    decryptFile(encryptedData) {
        try {
            const iv = encryptedData.slice(0, 16);
            const tag = encryptedData.slice(16, 32);
            const text = encryptedData.slice(32);
            
            const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(this.encryptionKey, 'hex'), iv);
            decipher.setAuthTag(tag);
            
            let decrypted = decipher.update(text, 'binary', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            throw error;
        }
    }

    /**
     * Restores database component
     * @param {string} componentName - Database name
     * @param {string} backupData - Decrypted backup content
     */
    async restoreDatabase(componentName, backupData) {
        try {
            const tempFilePath = `/tmp/${componentName}-restore.sql`;
            fs.writeFileSync(tempFilePath, backupData);
            
            // Execute database restore command
            const command = `mysql -u root -p${process.env.DB_PASSWORD} ${componentName} < ${tempFilePath}`;
            execSync(command);
            
            console.log(`${componentName} database restored`);
        } catch (error) {
            console.error(`Database restoration failed for ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * Restores filesystem component
     * @param {string} componentName - Filesystem path
     * @param {string} backupData - Decrypted backup content
     */
    async restoreFileSystem(componentName, backupData) {
        try {
            const targetPath = path.resolve(componentName);
            
            // Remove existing files
            if (fs.existsSync(targetPath)) {
                fs.rmSync(targetPath, { recursive: true, force: true });
            }
            
            // Extract backup archive
            const tempFilePath = `/tmp/${componentName.replace(/\//g, '-')}-restore.tar.gz`;
            fs.writeFileSync(tempFilePath, backupData, 'binary');
            
            const extractCommand = `tar -xzf ${tempFilePath} -C /`;
            execSync(extractCommand);
            
            console.log(`${componentName} filesystem restored`);
        } catch (error) {
            console.error(`Filesystem restoration failed for ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * Restores smart contract state
     * @param {string} componentName - Contract address
     * @param {string} backupData - Decrypted backup content
     */
    async restoreSmartContract(componentName, backupData) {
        try {
            const web3 = new (require('web3'))(process.env.WEB3_PROVIDER);
            const adminAccount = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
            web3.eth.accounts.wallet.add(adminAccount);
            
            const contract = new web3.eth.Contract(JSON.parse(backupData.abi), componentName);
            
            // Restore contract state variables
            for (const [variable, value] of Object.entries(backupData.state)) {
                const restoreMethod = `restore${variable.charAt(0).toUpperCase()}${variable.slice(1)}`;
                if (typeof contract.methods[restoreMethod] === 'function') {
                    const gasPrice = await web3.eth.getGasPrice();
                    const tx = contract.methods[restoreMethod](value);
                    const [gasLimit, nonce] = await Promise.all([
                        tx.estimateGas({ from: adminAccount.address }),
                        web3.eth.getTransactionCount(adminAccount.address)
                    ]);
                    
                    const txParams = {
                        to: componentName,
                        data: tx.encodeABI(),
                        gas: Math.floor(gasLimit * 1.2),
                        gasPrice,
                        nonce,
                        chainId: await web3.eth.getChainId()
                    };
                    
                    const signedTx = await web3.eth.accounts.signTransaction(txParams, adminAccount.privateKey);
                    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                    
                    console.log(`Restored ${variable} in ${componentName}:`, receipt.transactionHash);
                } else {
                    console.warn(`No restore method found for ${variable} in ${componentName}`);
                }
            }
        } catch (error) {
            console.error(`Smart contract restoration failed for ${componentName}:`, error);
            throw error;
        }
    }
}

module.exports = BackupRestorer;
