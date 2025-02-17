const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class OperationResumer {
    constructor(configDirectory) {
        this.configDirectory = configDirectory;
        this.systemConfig = {};
        this.loadSystemConfig();
    }

    /**
     * Loads system configuration
     */
    loadSystemConfig() {
        try {
            const configPath = path.join(this.configDirectory, 'system-config.json');
            const configData = fs.readFileSync(configPath, 'utf8');
            this.systemConfig = JSON.parse(configData);
            
            console.log('System configuration loaded');
        } catch (error) {
            console.error('Failed to load system configuration:', error);
            throw error;
        }
    }

    /**
     * Resumes all system operations after incident resolution
     */
    async resumeSystem() {
        try {
            console.log('Initiating system resumption...');
            
            // 1. Resume database operations
            await this.resumeDatabaseServices();
            
            // 2. Restart application servers
            await this.restartApplicationServers();
            
            // 3. Re-enable smart contract functions
            await this.resumeSmartContractOperations();
            
            // 4. Restore network services
            await this.resumeNetworkServices();
            
            // 5. Verify system health
            await this.verifySystemHealth();
            
            console.log('All system operations resumed successfully');
        } catch (error) {
            console.error('System resumption failed:', error);
            throw error;
        }
    }

    /**
     * Resumes database services
     */
    async resumeDatabaseServices() {
        try {
            console.log('Resuming database services...');
            
            for (const db of this.systemConfig.databases) {
                const command = `mysql -u root -p${process.env.DB_PASSWORD} -e "START SLAVE;" ${db.name}`;
                execSync(command);
                
                console.log(`Replication resumed for ${db.name}`);
            }
        } catch (error) {
            console.error('Failed to resume database services:', error);
            throw error;
        }
    }

    /**
     * Restarts application servers
     */
    async restartApplicationServers() {
        try {
            console.log('Restarting application servers...');
            
            for (const server of this.systemConfig.servers) {
                const command = `ssh ${server.user}@${server.host} "sudo systemctl restart ${server.service}"`;
                execSync(command);
                
                console.log(`Restarted ${server.service} on ${server.host}`);
            }
        } catch (error) {
            console.error('Failed to restart application servers:', error);
            throw error;
        }
    }

    /**
     * Resumes smart contract operations
     */
    async resumeSmartContractOperations() {
        try {
            console.log('Resuming smart contract operations...');
            const Web3 = require('web3');
            const web3 = new Web3(process.env.WEB3_PROVIDER);
            
            const adminAccount = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
            web3.eth.accounts.wallet.add(adminAccount);
            
            for (const contract of this.systemConfig.contracts) {
                const instance = new web3.eth.Contract(contract.abi, contract.address);
                
                // Unpause contract if needed
                const paused = await instance.methods.paused().call();
                if (paused) {
                    const tx = instance.methods.unpause();
                    const [gasLimit, nonce] = await Promise.all([
                        tx.estimateGas({ from: adminAccount.address }),
                        web3.eth.getTransactionCount(adminAccount.address)
                    ]);
                    
                    const txParams = {
                        to: contract.address,
                        data: tx.encodeABI(),
                        gas: Math.floor(gasLimit * 1.2),
                        gasPrice: await web3.eth.getGasPrice(),
                        nonce,
                        chainId: await web3.eth.getChainId()
                    };
                    
                    const signedTx = await web3.eth.accounts.signTransaction(txParams, adminAccount.privateKey);
                    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                    
                    console.log(`Unpaused contract at ${contract.address}:`, receipt.transactionHash);
                }
            }
        } catch (error) {
            console.error('Failed to resume smart contract operations:', error);
            throw error;
        }
    }

    /**
     * Resumes network services
     */
    async resumeNetworkServices() {
        try {
            console.log('Resuming network services...');
            
            // Restart load balancers
            for (const lb of this.systemConfig.loadBalancers) {
                const command = `ssh ${lb.user}@${lb.host} "sudo systemctl restart haproxy"`;
                execSync(command);
                
                console.log(`Load balancer restarted on ${lb.host}`);
            }
            
            // Re-enable firewall rules
            for (const fw of this.systemConfig.firewalls) {
                const command = `ssh ${fw.user}@${fw.host} "sudo ufw enable"`;
                execSync(command);
                
                console.log(`Firewall enabled on ${fw.host}`);
            }
        } catch (error) {
            console.error('Failed to resume network services:', error);
            throw error;
        }
    }

    /**
     * Verifies system health after resumption
     */
    async verifySystemHealth() {
        try {
            console.log('Verifying system health...');
            
            // Check database replication status
            for (const db of this.systemConfig.databases) {
                const command = `mysql -u root -p${process.env.DB_PASSWORD} -e "SHOW SLAVE STATUS\\G;" ${db.name}`;
                const output = execSync(command).toString();
                
                if (!output.includes('Slave_IO_Running: Yes') || !output.includes('Slave_SQL_Running: Yes')) {
                    throw new Error(`Database replication issue on ${db.name}`);
                }
                
                console.log(`Database replication verified for ${db.name}`);
            }
            
            // Check application server status
            for (const server of this.systemConfig.servers) {
                const command = `ssh ${server.user}@${server.host} "systemctl is-active ${server.service}"`;
                const status = execSync(command).toString().trim();
                
                if (status !== 'active') {
                    throw new Error(`Service ${server.service} not active on ${server.host}`);
                }
                
                console.log(`Server ${server.host} service status verified`);
            }
            
            // Check contract status
            const Web3 = require('web3');
            const web3 = new Web3(process.env.WEB3_PROVIDER);
            for (const contract of this.systemConfig.contracts) {
                const instance = new web3.eth.Contract(contract.abi, contract.address);
                const paused = await instance.methods.paused().call();
                
                if (paused) {
                    throw new Error(`Contract at ${contract.address} still paused`);
                }
                
                console.log(`Contract status verified for ${contract.address}`);
            }
        } catch (error) {
            console.error('System health verification failed:', error);
            throw error;
        }
    }
}

module.exports = OperationResumer;
