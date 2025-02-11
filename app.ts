import { App } from "astal/gtk3"
import style from "./style.scss"
import TopSpacer from "./widget/common/TopSpacer"
import { LeftFillerBar, TopFillerBar, RightFillerBar, BottomFillerBar } from "./widget/common/FillerBars"
import TopRightWindow from "./widget/TopRight/TopRightWindow"
import TopLeftWindow from "./widget/TopLeft/TopLeftWindow"
import TopCenterWindow from "./widget/TopCenter/TopCenterWindow"
import CloseTopLeftWindowArea from "./widget/TopLeft/CloseWindowArea"
import CloseTopCenterWindowArea from "./widget/TopCenter/CloseTopCenterWindowArea"
import { OnClickAppLauncherButton, OnClickCloseButton } from "./widget/TopLeft/BarWidgets"
import { OnClickClipboardButton, OnClickCloseTRButton } from "./widget/TopRight/BarButtons"
import { AppLauncherVisible, ClipboardVisible } from "./widget/common/Variables"
import NotificationPopups from "./widget/notifications/NotificationPopups"

App.start({
    css: style,
    main() {                
        App.get_monitors().map((gdkmonitor) => {
            
            TopSpacer(gdkmonitor);
            CloseTopLeftWindowArea(gdkmonitor);
            CloseTopCenterWindowArea(gdkmonitor);
            TopLeftWindow(gdkmonitor);

            TopCenterWindow(gdkmonitor);

            TopRightWindow(gdkmonitor);
            
            // BottomCorners(gdkmonitor);
            TopFillerBar(gdkmonitor);
            LeftFillerBar(gdkmonitor);
            RightFillerBar(gdkmonitor);
            BottomFillerBar(gdkmonitor);
            
            NotificationPopups(gdkmonitor);
        });
        
    },
    //To toggle my no window widgets
    requestHandler(request: string, res: (response: any) => void) {
        if (request == "OpenAppLauncher") {
            AppLauncherVisible.get() == true ? OnClickCloseButton() : OnClickAppLauncherButton();            
            return res("done")
        }
        if (request == "OpenClipboard") {
            ClipboardVisible.get() == true ? OnClickCloseTRButton() : OnClickClipboardButton();            
            return res("done")
        }

        res("unknown command")
    },
})
