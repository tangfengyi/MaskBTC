import UIKit
import WebRTC

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize WebRTC
        RTCInitializeSSL()
        
        let window = UIWindow(frame: UIScreen.main.bounds)
        self.window = window
        
        let rootViewController = ViewController()
        window.rootViewController = UINavigationController(rootViewController: rootViewController)
        window.makeKeyAndVisible()
        
        return true
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Clean up WebRTC
        RTCCleanupSSL()
    }
}

