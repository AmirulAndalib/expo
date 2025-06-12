import ExpoModulesCore
import WebKit

class PeekAndPopActionView: ExpoView {
  var id: String = ""
  var title: String = ""

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
  }

}
