import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3"
import { TopLeftWindowVisible } from "../common/Variables"
import { bind } from "astal/binding"
import { OnClickCloseButton } from "./BarWidgets";

const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

export const CloseWindowAreaName = "CloseWindowArea"

const CloseTopLeftWindow = () => {
    return new Widget.EventBox({        
        className: "CloseArea",
        expand: true,
        onClick:  () => OnClickCloseButton()
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
            visible={bind(TopLeftWindowVisible)}
            application={App}
            namespace={CloseWindowAreaName}>
                            
            <CloseTopLeftWindow />

        </window>
    );

    return closeWindowArea;
}