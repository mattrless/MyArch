import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopRightWindowVisible } from "../common/Variables"
import { bind } from "astal/binding"
import { OnClickCloseTRButton } from "./BarButtons";

const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

export const CloseWindowAreaName = "CloseWindowArea"

const CloseWindow = () => {
    return new Widget.EventBox({        
        className: "CloseArea",
        expand: true,
        onClick:  () => OnClickCloseTRButton()
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
            visible={bind(TopRightWindowVisible)}
            application={App}
            namespace={CloseWindowAreaName}>
                            
            <CloseWindow />

        </window>
    );

    return closeWindowArea;
}