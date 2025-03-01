import { App, Astal, Gdk } from "astal/gtk3"
    
const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor

/* Box inside window needed to set width of filler bar with scss */
export const LeftFillerBar = (gdkmonitor: Gdk.Monitor) => {    
    return <window
        className="FillerBar"
        gdkmonitor={gdkmonitor}
        layer={Astal.Layer.BACKGROUND}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | BOTTOM}            
        application={App}>
            <box className="LeftRightBox"/>
    </window>
}

export const RightFillerBar = (gdkmonitor: Gdk.Monitor) => {    
    return <window
        className="FillerBar"
        gdkmonitor={gdkmonitor}
        layer={Astal.Layer.BACKGROUND}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | RIGHT | BOTTOM}            
        application={App}>
            <box className="LeftRightBox"/>
    </window>
}

export const TopFillerBar = (gdkmonitor: Gdk.Monitor) => {    
    return <window
        className="FillerBar"
        gdkmonitor={gdkmonitor}
        layer={Astal.Layer.BACKGROUND}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}>
            <box className="TopBottomBox"/>
    </window>
}

export const BottomFillerBar = (gdkmonitor: Gdk.Monitor) => {    
    return <window
        className="FillerBar"
        gdkmonitor={gdkmonitor}
        layer={Astal.Layer.BACKGROUND}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={BOTTOM | LEFT | RIGHT}
        application={App}>
            <box className="TopBottomBox"/>
    </window>
}