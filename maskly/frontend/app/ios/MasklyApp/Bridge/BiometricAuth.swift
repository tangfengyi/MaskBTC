import Foundation
import LocalAuthentication

@objc(BiometricAuth)
class BiometricAuth: NSObject {
    private let context = LAContext()

    @objc func canAuthenticate(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            resolver("Biometric authentication available")
        } else {
            rejecter("BIOMETRIC_UNAVAILABLE", "Biometric authentication not available", error)
        }
    }

    @objc func authenticate(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Authenticate to access MASKLY") { success, error in
            DispatchQueue.main.async {
                if success {
                    resolver("Authentication successful")
                } else {
                    rejecter("AUTHENTICATION_FAILED", "Biometric authentication failed", error)
                }
            }
        }
    }
}

