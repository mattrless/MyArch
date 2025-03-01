import { Gtk, Gdk, Widget } from 'astal/gtk3';
import Cairo from 'cairo';
import { GLib } from 'astal';
import Hyprland from 'gi://AstalHyprland';
import { bind } from 'astal';
import { WindowTopLeftCorner, WindowTopRightCorner } from "../common/Corners";
import { WindowCornerStyle } from "../common/Variables";

//1856x976 its the area where the system windows show up
const scaleX = (150) / 1856;
const scaleY = (92) / 976;
const scale = Math.min(scaleX, scaleY);

const hypr = Hyprland.get_default()

function ToScale(size: number) {
    size = size 
    return (size * scale)
}

const Windows = ({ ws }: { ws: Hyprland.Workspace }) => {
    return (
        <box spacing={2}>
            {bind(ws, "clients").as(clients => {
                return clients.map(client => (
                    <box
                        className="Window"
                        widthRequest={bind(client, "width").as(w => ToScale(w))}
                        heightRequest={bind(client, "height").as(h => ToScale(h))}
                    >
                    </box>
                ));
            })}
        </box>
    )
}

const Previewer = () => {

    return (
        <box className="Previewer" spacing={7} >
            {bind(hypr, "workspaces").as(wss => wss
                .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // Excluir workspaces especiales
                .sort((a, b) => a.id - b.id)
                .map(ws => (
                    <eventbox
                        onScroll={(_, { delta_y }) => {
                            hypr.dispatch("workspace", delta_y < 0 ? "m+1" : "m-1");
                        }}
                        onClick={() => ws.focus()}
                    >
                        <box
                            className={bind(hypr, "focusedWorkspace").as(fw =>
                                ws === fw ? "focused" : "unfocused"
                            )}
                            homogeneous
                        >
                            <box className="WorkspaceContent">
                                <Windows ws={ws} />
                            </box>
                        </box>
                    </eventbox>
                ))
            )}
        </box>
    );
};


export default function () {
    return (
        <centerbox>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopRightCorner />
            </box>
            <box className="WorkspacesPreview" homogeneous>
                <Previewer />
            </box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopLeftCorner />
            </box>
        </centerbox>
    );
}

// .Window {
//     background-color: red;
//     color: $accent_color;
//     border-radius: $widget_bradius;
// }