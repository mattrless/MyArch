import { Astal, Gtk, Gdk, Widget } from "astal/gtk3"
import { Variable, GLib, bind } from "astal"
import Hyprland from "gi://AstalHyprland"
import { TopLeftCorner, TopRightCorner } from "../common/Corners";
import { OpenClosePreviewer } from "./TopCenterWindow"
import { TopCenterWindowVisible, TopCenterWindowKeymode } from "../common/Variables"

const FADE_DURATION = 1000

const { START, CENTER, END } = Gtk.Align
const hypr = Hyprland.get_default()

const Indicators = () => {
    return (
        <box 
            className="Workspaces" 
            spacing={7}
            homogeneous={false}
            visible={TopCenterWindowVisible().as((v: boolean) => !v)}
            >
            {bind(hypr, "workspaces").as(wss => wss
                .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
                .sort((a, b) => a.id - b.id)
                .map(ws => (
                    <button visible={TopCenterWindowVisible().as((v: boolean) => !v)}
                        className={bind(hypr, "focusedWorkspace").as(fw => ws === fw ? "focused" : "unfocused")}
                        onClicked={() => ws.focus()}
                    />
                ))
            )}
        </box>
    );
}

const Workspaces = () => {

    return (
        <eventbox
            onScroll = {(_, { delta_y }) => {
                hypr.dispatch("workspace", delta_y < 0 ? "m+1" : "m-1");
            }}
            onClick={() => {
                OpenClosePreviewer();
            }}
        >

            <box className="Container">
                <revealer
                    revealChild={TopCenterWindowVisible().as((v: boolean) => !v)}
                    transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                    transitionDuration={FADE_DURATION}>
                    <Indicators visible={TopCenterWindowVisible().as((v: boolean) => !v)}/>
                </revealer>

                <revealer
                    revealChild={bind(TopCenterWindowVisible)}
                    transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                    transitionDuration={FADE_DURATION}>
                    <button
                        visible={bind(TopCenterWindowVisible)}
                        className="ClosePreviewerButton"
                        label={"󰅙"}
                        onClicked={OpenClosePreviewer}
                    />
                </revealer>
            </box>
            
        </eventbox>
    );
}

export const WorkspacesBox = () => {
    return (
        <centerbox>
            <box halign={CENTER}>
                <TopRightCorner />
                <Workspaces />
                <TopLeftCorner />
            </box>
        </centerbox>
    );
}