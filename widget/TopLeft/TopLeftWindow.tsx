import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopLeftButtons } from "../TopLeft/BarWidgets"
import { TopLeftWindowVisible, TopLeftCurrentWindow, Keymode } from "../common/Variables"
import AppLauncher from "./AppLauncher"
import Dashboard from "./Dashboard"
import { bind } from "astal/binding"
import { OnClickCloseButton } from "../TopLeft/BarWidgets";

const SLIDER_DURATION = 200
const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
const { START, CENTER, END } = Gtk.Align

export const TopLeftWindowName = "TopLeftWindow"
    
export default function (gdkmonitor: Gdk.Monitor) {
    const topLeftWindow = (
        <window
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={LEFT | TOP}
            layer={Astal.Layer.TOP}
            className="TopLeftWindow"
            name={TopLeftWindowName}
            gdkmonitor={gdkmonitor}
            application={App}
            namespace={TopLeftWindowName}
            keymode={bind(Keymode)}
            onKeyPressEvent={function (self, event: Gdk.Event) {
                if (event.get_keyval()[1] === Gdk.KEY_Escape)
                    OnClickCloseButton();
            }}
            
            >
            <centerbox vexpand={true} vertical={true} className="TopLeftSection" homogeneous={false} valign={START}>
                <box valign={START}>
                    <revealer
                        revealChild={bind(TopLeftWindowVisible)}
                        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                        transitionDuration={SLIDER_DURATION}
                    >
                        <stack visibleChildName={bind(TopLeftCurrentWindow)} homogeneous={false}>
                            <box name="AppLauncher">
                                <AppLauncher />
                            </box>
                            <box name="Dashboard">
                                <Dashboard />
                            </box>
                            <box name="Default" />
                        </stack>
                    </revealer>
                </box>

                <box></box>

                <TopLeftButtons valign={END} />
            </centerbox>
        </window>
    );

    return topLeftWindow;
}