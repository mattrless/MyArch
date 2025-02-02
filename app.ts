import { App } from "astal/gtk3"
import style from "./style.scss"
import TopSpacer from "./widget/common/TopSpacer"
import { LeftFillerBar, TopFillerBar, RightFillerBar, BottomFillerBar } from "./widget/common/FillerBars"
import TopLeftWindow from "./widget/TopLeft/TopLeftWindow"
import TopCenterWindow from "./widget/TopCenter/TopCenterWindow"
import CloseTopLeftWindowArea from "./widget/TopLeft/CloseWindowArea"
import CloseTopCenterWindowArea from "./widget/TopCenter/CloseTopCenterWindowArea"
import { OnClickAppLauncherButton } from "./widget/TopLeft/BarWidgets"

App.start({
    css: style,
    main() {                
        App.get_monitors().map((gdkmonitor) => {
            
            TopSpacer(gdkmonitor);
            CloseTopLeftWindowArea(gdkmonitor);
            CloseTopCenterWindowArea(gdkmonitor);
            TopLeftWindow(gdkmonitor);

            TopCenterWindow(gdkmonitor);

            TopFillerBar(gdkmonitor);
            LeftFillerBar(gdkmonitor);
            RightFillerBar(gdkmonitor);
            BottomFillerBar(gdkmonitor);
            
        });
        
    },
    //To toggle my no window widgets
    requestHandler(request: string, res: (response: any) => void) {
        if (request == "OpenAppLauncher") {
            OnClickAppLauncherButton();
            return res("done")
        }
        res("unknown command")
    },
})
