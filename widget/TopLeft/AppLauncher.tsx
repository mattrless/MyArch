import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { AppNameText, FirstApp, AppLauncherVisible, WindowCornerStyle } from "../common/Variables";
import { OnClickCloseButton } from "./BarWidgets";
import { bind } from "astal/binding";
import {
    WindowTopLeftCorner,
    WindowBottomLeftCorner,
    WindowTopRightCorner,
    WindowBottomRightCorner
} from "../common/Corners";

function AppButton({ app }: { app: Apps.Application }) {
    return (
        <button
            className="AppButton"
            onClicked={() => {
                OnClickCloseButton();
                app.launch();
            }}
            >
            <box>
                <icon icon={app.iconName} />
                <box valign={Gtk.Align.CENTER} vertical>
                    <label className="name" truncate xalign={0} label={app.name} />
                    {app.description && (
                        <label
                            className="description"
                            wrap
                            xalign={0}
                            label={app.description}
                        />
                    )}
                </box>
            </box>
        </button>
    );
}

export default function () {
    const apps = new Apps.Apps();
    const allApps = apps.list;

    AppLauncherVisible.subscribe(() => {
        FirstApp.set(allApps[0]);
        adjustment.set_value(adjustment.get_upper() - adjustment.get_page_size());
    });

    const filteredApps = AppNameText((name) =>
        name.trim() ? apps.fuzzy_query(name) : allApps,
    );

    const updateFirstApp = () => {
        adjustment.set_value(adjustment.get_upper() - adjustment.get_page_size());

        const firstFilteredApp = filteredApps.get()?.[0];
        if (firstFilteredApp) {
            FirstApp.set(firstFilteredApp);
        }
    };
    AppNameText.subscribe(updateFirstApp);

    const adjustment = new Gtk.Adjustment({
        lower: 0,
        upper: allApps.length,
        value: allApps.length - 7,
        stepIncrement: 10,
        pageIncrement: 20,
        pageSize: 7,
    });

    return (
        <box>
            <box homogeneous={true} className="AppLauncher">
                {/* overlay to show the corners above the scrollable */}
                <overlay>
                    <scrollable vadjustment={adjustment}>
                        <box spacing={9} vertical={true}>
                            {filteredApps.as((filteredApp) =>
                                [...filteredApp]
                                .reverse()
                                .map((app) => <AppButton app={app} />),
                            )}
                        </box>
                    </scrollable>
                    <WindowTopLeftCorner />
                    <WindowTopRightCorner />
                    <WindowBottomLeftCorner />
                    <WindowBottomRightCorner />
                </overlay>
            </box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopLeftCorner />
            </box>
        </box>
    );
}