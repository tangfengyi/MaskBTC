import Foundation
import WebRTC

/// Bridge class for WebRTC functionality in iOS
@objc(WebRTCBridge)
class WebRTCBridge: NSObject {
    private var peerConnection: RTCPeerConnection?

    /// Creates a new RTCPeerConnection instance
    /// - Parameters:
    ///   - resolver: Block to resolve the promise with success message
    ///   - rejecter: Block to reject the promise with error details
    @objc func createPeerConnection(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            let config = RTCConfiguration()
            config.sdpSemantics = .unifiedPlan
            
            let constraints = RTCMediaConstraints(mandatoryConstraints: nil, optionalConstraints: nil)
            
            peerConnection = try WebRTCClient.factory.peerConnection(with: config, constraints: constraints, delegate: nil)
            
            if let _ = peerConnection {
                resolver("Peer connection created successfully")
            } else {
                throw NSError(domain: "WebRTCBridge", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Failed to initialize peer connection"])
            }
        } catch let error as NSError {
            rejecter("CREATE_ERROR", error.localizedDescription, error)
        }
    }

    /// Adds an ICE candidate to the existing RTCPeerConnection
    /// - Parameters:
    ///   - sdp: The SDP string of the ICE candidate
    ///   - sdpMLineIndex: The SDP m-line index
    ///   - sdpMid: The SDP media ID (optional)
    ///   - resolver: Block to resolve the promise with success message
    ///   - rejecter: Block to reject the promise with error details
    @objc func addIceCandidate(_ sdp: String, sdpMLineIndex: Int32, sdpMid: String?, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            guard let candidate = RTCIceCandidate(sdp: sdp, sdpMLineIndex: Int(sdpMLineIndex), sdpMid: sdpMid) else {
                throw NSError(domain: "WebRTCBridge", code: 1002, userInfo: [NSLocalizedDescriptionKey: "Invalid ICE candidate"])
            }
            
            peerConnection?.add(candidate)
            resolver("ICE candidate added successfully")
        } catch let error as NSError {
            rejecter("ADD_ICE_ERROR", error.localizedDescription, error)
        }
    }

    /// Closes the existing RTCPeerConnection
    /// - Parameters:
    ///   - resolver: Block to resolve the promise with success message
    ///   - rejecter: Block to reject the promise with error details
    @objc func closePeerConnection(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            guard let connection = peerConnection else {
                throw NSError(domain: "WebRTCBridge", code: 1003, userInfo: [NSLocalizedDescriptionKey: "No active peer connection to close"])
            }
            
            connection.close()
            peerConnection = nil
            resolver("Peer connection closed successfully")
        } catch let error as NSError {
            rejecter("CLOSE_ERROR", error.localizedDescription, error)
        }
    }
}

