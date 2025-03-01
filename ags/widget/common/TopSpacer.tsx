import { App, Astal, Gdk } from "astal/gtk3"
import { TopBarStyle } from "./Variables";
import { bind } from "astal/binding";

const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

export default function (gdkmonitor: Gdk.Monitor) {    
    return <window            
            gdkmonitor={gdkmonitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            layer={Astal.Layer.BOTTOM}
            anchor={TOP | LEFT | RIGHT}
            application={App}
            className="TopSpacer">
            <box className={bind(TopBarStyle)}/>
    </window>
}