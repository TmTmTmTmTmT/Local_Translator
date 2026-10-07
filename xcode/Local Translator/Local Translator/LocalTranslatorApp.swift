// Container app: one window. Extension enable guidance, language pack install (the only place downloads happen), Apple Intelligence status.
import SwiftUI

@main
struct LocalTranslatorApp: App {
    var body: some Scene {
        WindowGroup("Local Translator") {
            ContentView()
                .frame(width: 480)
        }
        .windowResizability(.contentSize)
    }
}
