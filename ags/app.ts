import { App } from "astal/gtk3"
import style from "./style.scss"
import TopSpacer from "./widget/common/TopSpacer"
import { LeftFillerBar, TopFillerBar, RightFillerBar, BottomFillerBar } from "./widget/common/FillerBars"
import TopRightWindow from "./widget/TopRight/TopRightWindow"
import TopLeftWindow from "./widget/TopLeft/TopLeftWindow"
import TopCenterWindow from "./widget/TopCenter/TopCenterWindow"
import CloseTopLeftWindowArea from "./widget/TopLeft/CloseWindowArea"
import CloseTopCenterWindowArea from "./widget/TopCenter/CloseTopCenterWindowArea"
import CloseTopRightWindowArea from "./widget/TopRight/CloseTopRightWindowArea"
import { OnClickAppLauncherButton, OnClickCloseButton, OnClickDashboardButton } from "./widget/TopLeft/BarWidgets"
import { OnClickClipboardButton, OnClickCloseTRButton } from "./widget/TopRight/BarButtons"
import { AppLauncherVisible, ClipboardVisible, DashboardVisible } from "./widget/common/Variables"
import NotificationPopups from "./widget/notifications/NotificationPopups"
import { ScreenBottomLeftCorner, ScreenBottomRightCorner } from "./widget/common/Corners"
import osd from "./widget/osd/osd"
import cssReload from './HotReload'

cssReload;
App.start({
    //css: style,
    main() {                
        const gdkmonitor = App.get_monitors()[0];

        if (gdkmonitor) {
            TopSpacer(gdkmonitor);
            // CloseTopLeftWindowArea(gdkmonitor);
            // CloseTopCenterWindowArea(gdkmonitor);
            // CloseTopRightWindowArea(gdkmonitor);
            TopLeftWindow(gdkmonitor);

            TopCenterWindow(gdkmonitor);

            TopRightWindow(gdkmonitor);
            osd(gdkmonitor)
            ScreenBottomLeftCorner(gdkmonitor);
            ScreenBottomRightCorner(gdkmonitor);
            TopFillerBar(gdkmonitor);
            LeftFillerBar(gdkmonitor);
            RightFillerBar(gdkmonitor);
            BottomFillerBar(gdkmonitor);
            
            NotificationPopups(gdkmonitor);
        }
        
    },
    //To toggle my no window widgets
    requestHandler(request: string, res: (response: any) => void) {
        if (request == "OpenAppLauncher") {
            AppLauncherVisible.get() ? OnClickCloseButton() : OnClickAppLauncherButton();            
            return res("done")
        }
        if (request == "OpenDashboard") {
            DashboardVisible.get() ? OnClickCloseButton() : OnClickDashboardButton();            
            return res("done")
        }
        if (request == "OpenClipboard") {
            ClipboardVisible.get() ? OnClickCloseTRButton() : OnClickClipboardButton();            
            return res("done")
        }


        res("unknown command")
    },
})
