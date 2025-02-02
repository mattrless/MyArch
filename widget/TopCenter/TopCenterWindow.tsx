import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopCenterWindowVisible, TopCenterWindowKeymode } from "../common/Variables"
import { bind } from "astal/binding"
import { WorkspacesBox } from "./Workspaces"
import WorkspacesPreview from "./WorkspacesPreview"

const SLIDER_DURATION = 200
const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
const { START, CENTER, END } = Gtk.Align

export const TopCenterWindowName = "TopCenterWindow"

export function OpenClosePreviewer() {
    TopCenterWindowVisible.set(!TopCenterWindowVisible.get());
    TopCenterWindowKeymode.set(
        TopCenterWindowKeymode.get() === Astal.Keymode.NONE 
        ? Astal.Keymode.ON_DEMAND
        : Astal.Keymode.NONE
    );
}

export default function (gdkmonitor: Gdk.Monitor) {
    const topCenterWindow = (
        <window
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={CENTER | TOP}
            layer={Astal.Layer.TOP}
            className="TopCenterWindow"
            name={TopCenterWindowName}
            gdkmonitor={gdkmonitor}
            application={App}
            namespace={TopCenterWindowName}
            keymode={bind(TopCenterWindowKeymode)}
            onKeyPressEvent={function (self, event: Gdk.Event) {
                    if (event.get_keyval()[1] === Gdk.KEY_Escape)
                        OpenClosePreviewer();
                }}
            >
            <centerbox vexpand={true} vertical={true} className="TopCenterSection" homogeneous={false} valign={START}>
                <box valign={START}>
                    <revealer
                        revealChild={bind(TopCenterWindowVisible)}
                        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                        transitionDuration={SLIDER_DURATION}
                    >
                        <WorkspacesPreview />
                    </revealer>
                </box>

                <box/>
                
                <WorkspacesBox valign={END} />

            </centerbox>
        </window>
    );

    return topCenterWindow;
}