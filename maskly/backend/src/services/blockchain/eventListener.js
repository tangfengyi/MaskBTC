const Web3 = require('web3');
const { EventEmitter } = require('events');

class BlockchainEventListener extends EventEmitter {
    constructor(providerUrl) {
        super();
        this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }

    listenToContractEvents(contractAddress, abi) {
        const contract = new this.web3.eth.Contract(abi, contractAddress);
        
        // Listen to Transfer events
        contract.events.Transfer()
            .on('data', (event) => {
                console.log('Transfer event detected:', event);
                this.emit('Transfer', event);
            })
            .on('error', (error) => {
                console.error('Error listening to Transfer events:', error);
            });

        // Listen to Approval events
        contract.events.Approval()
            .on('data', (event) => {
                console.log('Approval event detected:', event);
                this.emit('Approval', event);
            })
            .on('error', (error) => {
                console.error('Error listening to Approval events:', error);
            });

        // Listen to all other events
        contract.events.allEvents()
            .on('data', (event) => {
                console.log('Other event detected:', event);
                this.emit('event', event);
            })
            .on('error', (error) => {
                console.error('Error listening to contract events:', error);
            });
    }
}

module.exports = BlockchainEventListener;

