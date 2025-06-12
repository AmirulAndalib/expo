import ExpoModulesCore

public class PeekAndPopModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRouterPeekAndPop")

    View(PeekAndPopView.self) {
      Prop("nextScreenId") { (view: PeekAndPopView, nextScreenId: String) in
        view.setNextScreenId(nextScreenId)
      }

      Events(
        "onPreviewTapped",
        "onWillPreviewOpen",
        "onDidPreviewOpen",
        "onPreviewWillClose",
        "onPreviewDidClose",
        "onActionSelected"
      )
    }

    View(PeekAndPopPreviewView.self) {
      Events("onSetSize")

      Prop("preferredContentSize") { (view: PeekAndPopPreviewView, size: [String: Int]) in
        let width = size["width", default: 0]
        let height = size["height", default: 0]

        guard width >= 0, height >= 0 else {
          print("Preferred content size cannot be negative (\(width), \(height))")
          return
        }

        view.preferredContentSize = CGSize(
          width: width,
          height: height
        )
      }
    }

    View(PeekAndPopActionView.self) {
      Prop("id") { (view: PeekAndPopActionView, id: String) in
        view.id = id
      }
      Prop("title") { (view: PeekAndPopActionView, title: String) in
        view.title = title
      }
    }

    View(PeekAndPopTriggerView.self) {}
  }
}
