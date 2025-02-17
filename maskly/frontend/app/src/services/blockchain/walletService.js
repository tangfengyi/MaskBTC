import Web3 from 'web3';
import SecurityABI from '../../../../blockchain/contracts/security/QuantumResistantSignature.json';

class WalletService {
    constructor() {
        this.web3 = new Web3(window.ethereum);
        this.accounts = [];
        this.securityContract = new this.web3.eth.Contract(
            SecurityABI.abi,
            process.env.REACT_APP_SECURITY_CONTRACT_ADDRESS
        );
    }

    validateAccount(account) {
        if (!account || typeof account !== 'string' || !/^(0x)?[0-9a-fA-F]{40}$/.test(account)) {
            throw new Error('Invalid Ethereum address');
        }
    }

    async connectWallet() {
        try {
            const accounts = await this.web3.eth.requestAccounts();
            this.validateAccount(accounts[0]);
            this.accounts = accounts;
            console.log('Connected wallet:', this.accounts[0]);
            return this.accounts[0];
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async getBalance(account) {
        try {
            const balance = await this.web3.eth.getBalance(account);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }

    async registerDevice(fingerprint, bioHash) {
        try {
            const account = this.accounts[0];
            const messageHash = this.web3.utils.soliditySha3(
                {t: 'bytes32', v: fingerprint},
                {t: 'bytes32', v: bioHash},
                {t: 'address', v: account}
            );
            
            const signature = await this.web3.eth.personal.sign(
                messageHash, 
                account
            );

            return this.securityContract.methods.registerPublicKey(
                {x: fingerprint, y: bioHash},
                signature
            ).send({from: account});
        } catch (error) {
            console.error('Device registration failed:', error);
            throw error;
        }
    }

    async quickTransaction(to, value) {
        try {
            const account = this.accounts[0];
            const txHash = this.web3.utils.soliditySha3(
                to,
                value,
                Date.now()
            );
            
            // 获取设备签名
            const deviceSig = await this.web3.eth.personal.sign(
                txHash, 
                account
            );

            // 调用快速验证
            return this.securityContract.methods.quickVerify(
                account,
                txHash,
                deviceSig
            ).send({from: account, value});
        } catch (error) {
            console.error('Quick transaction failed:', error);
            throw error;
        }
    }
}

export default WalletService;
