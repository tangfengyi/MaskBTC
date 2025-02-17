import UIKit
import WebRTC

class ViewController: UIViewController {

    private var webRTCBridge: WebRTCBridge?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.view.backgroundColor = .white
        
        // Initialize WebRTCBridge
        webRTCBridge = WebRTCBridge()
        
        let button = UIButton(type: .system)
        button.setTitle("Create Peer Connection", for: .normal)
        button.frame = CGRect(x: 100, y: 100, width: 200, height: 50)
        button.addTarget(self, action: #selector(createPeerConnection), for: .touchUpInside)
        self.view.addSubview(button)
    }

    @objc func createPeerConnection() {
        webRTCBridge?.createPeerConnection({ message in
            print(message)
            DispatchQueue.main.async {
                let alert = UIAlertController(title: "Success", message: message as? String, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(alert, animated: true, completion: nil)
            }
        }, rejecter: { code, message, error in
            print("Error \(code): \(message ?? "")")
        })
    }
}

