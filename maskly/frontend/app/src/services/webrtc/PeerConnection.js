import { RTCPeerConnection } from 'react-native-webrtc';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:numb.viagenie.ca', username: 'username', credential: 'password' }
    ]
};

class PeerConnection {
    constructor() {
        this.peerConnection = new RTCPeerConnection(configuration);
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    async createAnswer() {
        try {
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    addIceCandidate(candidate) {
        try {
            this.peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            throw error;
        }
    }
}

export default PeerConnection;

