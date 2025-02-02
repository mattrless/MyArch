import { Gtk, Gdk, Widget } from 'astal/gtk3';
import Cairo from 'cairo';
import { GLib } from 'astal';
import Hyprland from 'gi://AstalHyprland';
import { bind, Binding } from 'astal';
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
                clients.map(client => (

                    <drawingarea
                        className="Window"
                        setup={(widget) => {
                            const widthBinding = bind(client, "width");
                            const heightBinding = bind(client, "height");

                            const width = widthBinding instanceof Binding ? widthBinding.get() : widthBinding;
                            const height = heightBinding instanceof Binding ? heightBinding.get() : heightBinding;

                            const scaledWidth = ToScale(width);
                            const scaledHeight = ToScale(height);

                            // Obtener la posición (x, y) del cliente
                            const x = client.x;
                            const y = client.y;

                            // Aplicamos la escala a la posición si es necesario
                            const scaledX = ToScale(x);
                            const scaledY = ToScale(y);

                            widget.set_size_request(scaledWidth, scaledHeight);
                            widget.set_margin_start(scaledX);
                            widget.set_margin_top(scaledY);

                            widget.connect("draw", (_, cairoContext: Cairo.Context) => {
                                const allocatedWidth = widget.get_allocated_width();
                                const allocatedHeight = widget.get_allocated_height();

                                const styleContext = widget.get_style_context();
                                const bgColor = styleContext.get_background_color(Gtk.StateFlags.NORMAL);
                                const borderColor = styleContext.get_color(Gtk.StateFlags.NORMAL);

                                const borderRadius = 10;

                                cairoContext.setSourceRGBA(bgColor.red, bgColor.green, bgColor.blue, bgColor.alpha);
                                cairoContext.moveTo(borderRadius, 0);
                                cairoContext.lineTo(allocatedWidth - borderRadius, 0);
                                cairoContext.arc(allocatedWidth - borderRadius, borderRadius, borderRadius, -Math.PI / 2, 0);
                                cairoContext.lineTo(allocatedWidth, allocatedHeight - borderRadius);
                                cairoContext.arc(allocatedWidth - borderRadius, allocatedHeight - borderRadius, borderRadius, 0, Math.PI / 2);
                                cairoContext.lineTo(borderRadius, allocatedHeight);
                                cairoContext.arc(borderRadius, allocatedHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
                                cairoContext.lineTo(0, borderRadius);
                                cairoContext.arc(borderRadius, borderRadius, borderRadius, Math.PI, -Math.PI / 2);
                                cairoContext.closePath();
                                cairoContext.fill();

                                cairoContext.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
                                cairoContext.setLineWidth(4);

                                cairoContext.moveTo(borderRadius, 0);
                                cairoContext.lineTo(allocatedWidth - borderRadius, 0);
                                cairoContext.arc(allocatedWidth - borderRadius, borderRadius, borderRadius, -Math.PI / 2, 0);
                                cairoContext.lineTo(allocatedWidth, allocatedHeight - borderRadius);
                                cairoContext.arc(allocatedWidth - borderRadius, allocatedHeight - borderRadius, borderRadius, 0, Math.PI / 2);
                                cairoContext.lineTo(borderRadius, allocatedHeight);
                                cairoContext.arc(borderRadius, allocatedHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
                                cairoContext.lineTo(0, borderRadius);
                                cairoContext.arc(borderRadius, borderRadius, borderRadius, Math.PI, -Math.PI / 2);
                                cairoContext.closePath();
                                cairoContext.stroke();
                            });
                        }}
                    />


                ));
            })}
        </box>
    );
};


const Previewer = () => {

    return (
        <box className="Previewer" spacing={7} homogeneous>
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
                                <Windows ws={ws}/>
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