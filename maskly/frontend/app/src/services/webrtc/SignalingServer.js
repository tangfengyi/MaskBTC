import WebSocket from 'ws';

class SignalingServer {
    constructor(serverUrl) {
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = () => console.log('Connected to signaling server');
        this.socket.onmessage = (message) => this.handleMessage(message);
        this.socket.onclose = () => console.log('Disconnected from signaling server');
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open.');
        }
    }

    handleMessage(message) {
        const data = JSON.parse(message.data);
        console.log('Received message:', data);
        // Handle different types of messages here
    }
}

export default SignalingServer;

