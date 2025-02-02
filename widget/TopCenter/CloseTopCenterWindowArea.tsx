import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopCenterWindowVisible } from "../common/Variables"
import { bind } from "astal/binding"
import { OpenClosePreviewer } from "./TopCenterWindow";

const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

export const CloseWindowAreaName = "CloseWindowArea"

const CloseWindow = () => {
    return new Widget.EventBox({        
        className: "CloseArea",
        expand: true,
        onClick:  () => OpenClosePreviewer()
    })
}

export default function (gdkmonitor: Gdk.Monitor) {
    
    const closeWindowArea = (
        <window
            exclusivity={Astal.Exclusivity.IGNORE}
            anchor={LEFT | TOP | RIGHT | BOTTOM}
            layer={Astal.Layer.TOP}
            className="CloseWindowArea"
            name={CloseWindowAreaName}
            gdkmonitor={gdkmonitor}
            visible={bind(TopCenterWindowVisible)}
            application={App}
            namespace={CloseWindowAreaName}>
                            
            <CloseWindow />

        </window>
    );

    return closeWindowArea;
}