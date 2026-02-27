import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Variable, GLib } from "astal";
import { TopRightCorner, WindowTopRightCorner } from "../common/Corners";
import { bind, Binding } from "astal/binding";
import {    ClipboardVisible,
            NotificationCenterVisible,
            SettingsVisible,
            TopRightWindowVisible,
            TopRightCurrentWindow,
            TopRightWindowKeymode,
            time,
            TrayIconButtonLabel,
            TrayIconsVisible,
            AudioDevicesVisibility,
            DevicesLabel
        } from "../common/Variables";
import Wp from "gi://AstalWp";
import Tray from "gi://AstalTray"
import type Gio from "gi://Gio";

const speaker = Wp.get_default()!.audio.defaultSpeaker;

const SLIDE_TIMEOUT = 200;
const FADE_DURATION = 1000;


export const OnClickClipboardButton = () => {
    if (TopRightWindowVisible.get() && TopRightCurrentWindow.get() !== "Clipboard") {
        OnClickCloseTRButton();
        setTimeout(() => {
            TopRightWindowKeymode.set(Astal.Keymode.EXCLUSIVE);
            ClipboardVisible.set(true);
            TopRightWindowVisible.set(true);
            TopRightCurrentWindow.set("Clipboard");
        }, SLIDE_TIMEOUT);
    } else if (!TopRightWindowVisible.get()) {
        TopRightWindowKeymode.set(Astal.Keymode.EXCLUSIVE);
        ClipboardVisible.set(true);
        TopRightWindowVisible.set(true);
        TopRightCurrentWindow.set("Clipboard");
    }
};

export const OnClickNotificationCenterButton = () => {
    if (TopRightWindowVisible.get() && TopRightCurrentWindow.get() !== "NotificationCenter") {
        OnClickCloseTRButton();
        setTimeout(() => {
            TopRightWindowKeymode.set(Astal.Keymode.ON_DEMAND);
            NotificationCenterVisible.set(true);
            TopRightWindowVisible.set(true);
            TopRightCurrentWindow.set("NotificationCenter");
        }, SLIDE_TIMEOUT);
    } else if (!TopRightWindowVisible.get()) {
        TopRightWindowKeymode.set(Astal.Keymode.ON_DEMAND);
        NotificationCenterVisible.set(true);
        TopRightWindowVisible.set(true);
        TopRightCurrentWindow.set("NotificationCenter");
    }
};

export const OnClickSettingsButton = () => {
    if (TopRightWindowVisible.get() && TopRightCurrentWindow.get() !== "Settings") {
        OnClickCloseTRButton();
        setTimeout(() => {
            TopRightWindowKeymode.set(Astal.Keymode.ON_DEMAND);
            SettingsVisible.set(true);
            TopRightWindowVisible.set(true);
            TopRightCurrentWindow.set("Settings");
        }, SLIDE_TIMEOUT);
    } else if (!TopRightWindowVisible.get()) {
        TopRightWindowKeymode.set(Astal.Keymode.ON_DEMAND);
        SettingsVisible.set(true);
        TopRightWindowVisible.set(true);
        TopRightCurrentWindow.set("Settings");
    }
};

export const OnClickCloseTRButton = () => {
    ClipboardVisible.set(false);
    NotificationCenterVisible.set(false);
    SettingsVisible.set(false);
    TopRightWindowVisible.set(false);
    AudioDevicesVisibility.set(false);
    DevicesLabel.set("");
    TopRightWindowKeymode.set(Astal.Keymode.NONE);

    setTimeout(() => {
        TopRightCurrentWindow.set("Default");
    }, SLIDE_TIMEOUT);
};


function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup): Gtk.Menu {
    const menu = Gtk.Menu.new_from_model(menuModel);
    menu.insert_action_group("dbusmenu", actionGroup);
    return menu;
}

const TrayIconsButton = () => {
    const tray = Tray.get_default();

    return (
        <box className={'Button TrayIconsButton'} spacing={6}>
            <eventbox
                onHover={() => {
                    TrayIconsVisible.set(true);
                    TrayIconButtonLabel.set( TrayIconButtonLabel.get() === "" ? "" : "");                    
                }}

                onHoverLost={() => {
                    TrayIconsVisible.set(false);
                    TrayIconButtonLabel.set("");
                }}
            >
                <box>
                    <label label={bind(TrayIconButtonLabel)} />
                    <box 
                        visible={bind(TrayIconsVisible)}                        
                        spacing={6}
                        className="TrayIconsContainer"
                    >

                        {
                            bind(tray, "items").as((items) => {
                                return items
                                    .sort((a, b) => a.title.localeCompare(b.title))
                                    .map((item) => {
                                        const menu = createMenu(item.menuModel, item.actionGroup);

                                        return (
                                            <button
                                                className="tray-item"
                                                tooltipText={bind(item, "tooltip_markup")}
                                                onDestroy={() => menu.destroy()}
                                                onClick={(self, event) => {
                                                    if (event.button == Astal.MouseButton.PRIMARY) {
                                                        item.activate(event.x, event.y);
                                                    } else if (event.button == Astal.MouseButton.MIDDLE) {
                                                        item.secondary_activate(event.x, event.y);
                                                    } else if (event.button == Astal.MouseButton.SECONDARY) {
                                                        menu.popup_at_widget(
                                                            self,
                                                            Gdk.Gravity.SOUTH,
                                                            Gdk.Gravity.NORTH,
                                                            null
                                                        );
                                                    }
                                                }}
                                            >
                                                <icon 
                                                    gicon={bind(item, "gicon")}
                                                />
                                            </button>
                                        );
                                    });
                                }
                            )
                        }
                    </box>
                    
                </box>
                
            </eventbox>

            <eventbox
                visible={bind(SettingsVisible().as((v: boolean) => !v))}
                onClick={()=>{
                    speaker.mute = !speaker.mute;
                }}
                onScroll = {(_, { delta_y }) => {
                    if (delta_y < 0) {
                        speaker.volume = Math.min(speaker.volume + 0.05, 1);
                    } else {
                        speaker.volume = Math.max(speaker.volume - 0.05, 0);
                    }
                }}
            >
                <icon icon={bind(speaker, "volumeIcon")} />
            </eventbox>
        </box>
    );
    
}

const ClipboardButton = () => {
    
    return <AnimatedButton
        visibleVariable={ClipboardVisible}
        openWindowLabel="󰨸"
        closeWindowLabel="󰅙"
        onClick={OnClickClipboardButton}
        btnClassName="ClipboardButton"
    />
}

const NotificationCenterButton = () => {
    
    return <AnimatedButton
        visibleVariable={NotificationCenterVisible}
        openWindowLabel={bind(time)}
        closeWindowLabel="󰅙"
        onClick={OnClickNotificationCenterButton}
        btnClassName="NotificationCenterButton"
    />
}

const SettingsButton = () => {
    
    return <AnimatedButton
        visibleVariable={SettingsVisible}
        openWindowLabel=""
        closeWindowLabel="󰅙"
        onClick={OnClickSettingsButton}
        btnClassName="SettingsButton"
    />
}

export const TopRightButtons = () => {
    return <box vexpand={true} vertical={true} homogeneous={false}>
        <box halign={Gtk.Align.END}>
            <TopRightCorner />
            <box vertical={true}>
                <box className="Divisor" visible={bind(TopRightWindowVisible)}/>
                <box className="TopRightButtons">
                    <TrayIconsButton />
                    <ClipboardButton />
                    <NotificationCenterButton />
                    <SettingsButton />
                </box>
            </box>
        </box>
        <WindowTopRightCorner />
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
    openWindowLabel: string | Binding<string>;
    closeWindowLabel: string;
    onClick: () => void;
    btnClassName: string;
}) => {
    const openLabel = openWindowLabel instanceof Binding
        ? openWindowLabel
        : bind({ get: () => openWindowLabel, subscribe: () => () => {} });
    const openLabelClassName = btnClassName === 'NotificationCenterButton' ? 'ButtonTextLabel' : 'ButtonIconLabel';

    return (
        <box>
            <revealer
                revealChild={visibleVariable().as((v: boolean) => !v)}
                transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                transitionDuration={FADE_DURATION}>
                <button
                    visible={visibleVariable().as((v: boolean) => !v)}
                    className={`Button ${btnClassName}`}
                    onClicked={onClick}
                >
                    <label className={openLabelClassName} label={bind(openLabel)}></label>
                </button>
            </revealer>

            <revealer
                revealChild={bind(visibleVariable)}
                transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                transitionDuration={FADE_DURATION}>
                <button
                    visible={bind(visibleVariable)}
                    className={btnClassName === 'NotificationCenterButton' ? `Button ${btnClassName}` : `Button CloseButton`}
                    onClicked={OnClickCloseTRButton}
                >                    
                    <label className="ButtonIconLabel CloseIconLabel" label={closeWindowLabel}></label>
                </button>            
            </revealer>
        </box>
    );
};
