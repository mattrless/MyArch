import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopRightButtons } from "./BarButtons"
import { TopRightWindowVisible, TopRightCurrentWindow, TopRightWindowKeymode } from "../common/Variables"
import Clipboard from "./Clipboard"
//import Dashboard from "./Dashboard"
import { bind } from "astal/binding"
import { OnClickCloseTRButton } from "./BarButtons"

const SLIDER_DURATION = 200
const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
const { START, CENTER, END } = Gtk.Align

export const TopRightWindowName = "TopRightWindow"
    
export default function (gdkmonitor: Gdk.Monitor) {
    const topRightWindow = (
        <window
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={RIGHT | TOP}
            layer={Astal.Layer.TOP}
            className="TopRightWindow"
            name={TopRightWindowName}
            gdkmonitor={gdkmonitor}
            application={App}
            namespace={TopRightWindowName}
            keymode={bind(TopRightWindowKeymode)}
            onKeyPressEvent={function (self, event: Gdk.Event) {
                if (event.get_keyval()[1] === Gdk.KEY_Escape)
                    OnClickCloseTRButton();
                    
            }}
            
            >
            <centerbox vexpand={true} vertical={true} className="TopRightSection" homogeneous={false} valign={START}>
                <box valign={START}>
                    <revealer
                        revealChild={bind(TopRightWindowVisible)}
                        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                        transitionDuration={SLIDER_DURATION}
                    >
                        <stack visibleChildName={bind(TopRightCurrentWindow)} homogeneous={false}>
                            <box name="Clipboard">
                                <Clipboard />
                            </box>
                            <box name="NotificationCenter">
                                {/* <Dashboard /> */}
                            </box>
                            <box name="Settings">
                                {/* <Dashboard /> */}
                            </box>
                            <box name="Default" />
                        </stack>
                    </revealer>
                </box>

                <box/>

                <TopRightButtons valign={END} />
            </centerbox>
        </window>
    );

    return topRightWindow;
}