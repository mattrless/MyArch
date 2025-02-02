import Apps from "gi://AstalApps";
import Hyprland from 'gi://AstalHyprland';
import { bind } from 'astal';
import { WindowTopLeftCorner, WindowTopRightCorner } from "../common/Corners";
import { WindowCornerStyle } from "../common/Variables";

const hypr = Hyprland.get_default()

const Icons = ({ ws }: { ws: Hyprland.Workspace }) => {
    const apps = new Apps.Apps();
    return (
        <box spacing={2} homogeneous>
            {bind(ws, "clients").as(clients => {                            
                return clients.map(client => {      

                    let appClass = bind(client, "class").get() || "application-default-icon";
                    appClass = appClass.split(".").pop() || appClass;
                    let app = apps.fuzzy_query(appClass)[0];

                    return (
                        <icon className="WindowIcon" icon={app?.iconName} />
                    );

                });
            })}
        </box>
    );
};

const Previewer = () => {

    return (
        <box className="Previewer" spacing={6} >
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
                            <box className="WorkspaceContent" homogeneous>
                                <Icons ws={ws} />
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