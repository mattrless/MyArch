import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { TopLeftCorner, WindowTopLeftCorner } from "../common/Corners";
import { bind } from "astal/binding";
import {    AppLauncherVisible,
            DashboardVisible,
            TopLeftWindowVisible,
            TopLeftCurrentWindow,
            AppNameText,
            Keymode,
            FirstApp,
            TopBarStyle,
            StyleLabel,
            WindowCornerStyle
        } from "../common/Variables";
//󰣇
//󰅙

const SLIDE_TIMEOUT = 200;
const FADE_DURATION = 1000;

let appNameEntry: Widget.Entry

export const OnClickAppLauncherButton = () => {
    if (TopLeftWindowVisible.get() && TopLeftCurrentWindow.get() === "Dashboard") {
        OnClickCloseButton();
        setTimeout(() => {
            Keymode.set(Astal.Keymode.EXCLUSIVE);
            
            AppLauncherVisible.set(true);
            TopLeftWindowVisible.set(true);
            TopLeftCurrentWindow.set("AppLauncher");
            appNameEntry.grab_focus_without_selecting();
        }, SLIDE_TIMEOUT);        
    } else if (!TopLeftWindowVisible.get()) {
        // If theres no "window" opened then opens applauncher
        Keymode.set(Astal.Keymode.EXCLUSIVE);

        AppLauncherVisible.set(true);
        TopLeftWindowVisible.set(true);
        TopLeftCurrentWindow.set("AppLauncher");
        appNameEntry.grab_focus_without_selecting();
    }
}

function OnClickDashboardButton() {
    if (TopLeftWindowVisible.get() && TopLeftCurrentWindow.get() === "AppLauncher") {
        OnClickCloseButton();
        setTimeout(() => {
            Keymode.set(Astal.Keymode.ON_DEMAND);
            DashboardVisible.set(true);
            
            TopLeftWindowVisible.set(true);
            TopLeftCurrentWindow.set("Dashboard");

        }, SLIDE_TIMEOUT);
    } else if (!TopLeftWindowVisible.get()) {
        // If theres no "window" opened then opens dashboard
        Keymode.set(Astal.Keymode.ON_DEMAND);
        DashboardVisible.set(true);
        
        TopLeftWindowVisible.set(true);
        TopLeftCurrentWindow.set("Dashboard");
    }
}

export const OnClickCloseButton= () => {
    
    AppLauncherVisible.set(false);
    DashboardVisible.set(false);
    TopLeftWindowVisible.set(false);

    if(!AppLauncherVisible.get()){
        AppNameText.set("")
        Keymode.set(Astal.Keymode.NONE);
        FirstApp.set(null);
    }

    setTimeout(() => {
        TopLeftCurrentWindow.set("Default");
    }, SLIDE_TIMEOUT);
}


const AppLauncherButton = () => {
    
    return <AnimatedButton
        visibleVariable={AppLauncherVisible}
        openWindowLabel=""
        closeWindowLabel="󰅙"
        onClick={OnClickAppLauncherButton}
        btnClassName="AppLauncherButton"
    />
}

const DashboardButton = () => {

    return <AnimatedButton 
        visibleVariable={DashboardVisible}
        openWindowLabel="Dashboard"
        closeWindowLabel="󰅙"
        onClick={OnClickDashboardButton}
        btnClassName="DashboardButton"
    />
}

const AppNameEntry = () => {
    appNameEntry = new Widget.Entry({
        className: "Button AppNameEntry",
        visible: bind(AppLauncherVisible),
        text: AppNameText(),
        on_changed: (self) => AppNameText.set(self.text),
        onActivate: () => {
            let firstApp = FirstApp.get();
            if (firstApp) {
                firstApp.launch();
                OnClickCloseButton();
            }
        },
    }); 
    return appNameEntry;
};

const StyleButton = () => {
    return <button
        className="Button StyleButton"
        label={bind(StyleLabel)}
        onClicked={() => {
            if (TopBarStyle.get() === "TransparentSpacer") {
                TopBarStyle.set("ColoredSpacer");
                WindowCornerStyle.set("ColoredSpacerCorner");
                StyleLabel.set("");
            } else {
                TopBarStyle.set("TransparentSpacer");
                WindowCornerStyle.set("TransparentSpacerCorner");
                StyleLabel.set("󰖯");
            }
        }}/>
}

export const TopLeftButtons  = () => {
    return <box vexpand={true} vertical={true} homogeneous={false}>
        <box>
            <box vertical={true}>
                <box className="Divisor" visible={bind(TopLeftWindowVisible)}/>
                <box className="TopLeftButtons">
                    <AppNameEntry />
                    <AppLauncherButton />
                    <DashboardButton />
                    <StyleButton />
                </box>
            </box>
            <TopLeftCorner />
        </box>
        <WindowTopLeftCorner />        
    </box>
}

const AnimatedButton = ({
    visibleVariable,
    openWindowLabel,
    closeWindowLabel,
    onClick,
    btnClassName,
}: {
    visibleVariable: any;
    openWindowLabel: string;
    closeWindowLabel: string;
    onClick: () => void;
    btnClassName: string;
}) => {
    return (
        <box>
            <revealer
                revealChild={visibleVariable().as((v: boolean) => !v)}
                transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                transitionDuration={FADE_DURATION}>
                <button
                    visible={visibleVariable().as((v: boolean) => !v)}
                    className={`Button ${btnClassName}`}
                    label={openWindowLabel}
                    onClicked={onClick}
                />
            </revealer>

            <revealer
                revealChild={bind(visibleVariable)}
                transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                transitionDuration={FADE_DURATION}>
                <button
                    visible={bind(visibleVariable)}
                    className={`Button ${btnClassName}`}
                    label={closeWindowLabel}
                    onClicked={OnClickCloseButton}
                />
            </revealer>
        </box>
    );
};

