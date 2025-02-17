package com.maskly.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.maskly.app.native.WebRTCModule
import com.maskly.app.native.FaceDetection
import org.webrtc.PeerConnectionFactory

class MainActivity : AppCompatActivity() {

    private lateinit var webRTCModule: WebRTCModule
    private lateinit var faceDetection: FaceDetection

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize PeerConnectionFactory
        PeerConnectionFactory.initialize(PeerConnectionFactory.InitializationOptions.builder(this).createInitializationOptions())

        // Initialize WebRTCModule
        val factory = PeerConnectionFactory.builder().createPeerConnectionFactory()
        webRTCModule = WebRTCModule()
        webRTCModule.createPeerConnection(factory)

        // Initialize FaceDetection
        faceDetection = FaceDetection()
    }
}

