package com.maskly.app.native

import android.util.Log
import org.webrtc.*
import org.webrtc.PeerConnection.*
import java.util.*

class WebRTCModule {
    private var peerConnection: PeerConnection? = null

    fun createPeerConnection(factory: PeerConnectionFactory): Boolean {
        val iceServers = listOf(
            PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer()
        )

        val config = RTCConfiguration(iceServers).apply {
            sdpSemantics = SdpSemantics.UNIFIED_PLAN
        }

        val constraints = MediaConstraints().apply {
            mandatory.add(MediaConstraints.KeyValuePair("OfferToReceiveAudio", "true"))
            mandatory.add(MediaConstraints.KeyValuePair("OfferToReceiveVideo", "true"))
        }

        peerConnection = factory.createPeerConnection(config, object : Observer {
            override fun onIceCandidate(p0: IceCandidate?) {
                Log.d("WebRTCModule", "onIceCandidate: $p0")
            }

            override fun onIceConnectionChange(p0: PeerConnection.IceConnectionState?) {
                Log.d("WebRTCModule", "onIceConnectionChange: $p0")
            }

            override fun onAddStream(p0: MediaStream?) {
                Log.d("WebRTCModule", "onAddStream: $p0")
            }

            override fun onRemoveStream(p0: MediaStream?) {
                Log.d("WebRTCModule", "onRemoveStream: $p0")
            }

            override fun onDataChannel(p0: DataChannel?) {
                Log.d("WebRTCModule", "onDataChannel: $p0")
            }

            override fun onRenegotiationNeeded() {
                Log.d("WebRTCModule", "onRenegotiationNeeded")
            }

            override fun onSignalingChange(p0: PeerConnection.SignalingState?) {
                Log.d("WebRTCModule", "onSignalingChange: $p0")
            }
        })

        return peerConnection != null
    }

    fun addIceCandidate(sdp: String, sdpMLineIndex: Int, sdpMid: String?): Boolean {
        val candidate = IceCandidate(sdpMid, sdpMLineIndex, sdp)
        peerConnection?.addIceCandidate(candidate)
        return true
    }
}

