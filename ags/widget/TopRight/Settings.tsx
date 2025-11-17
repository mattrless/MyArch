import { Gtk, Astal } from "astal/gtk3";
import { readFile, writeFile, monitorFile } from "astal/file";
import { bind } from "astal/binding";
import { WindowCornerStyle, DevicesLabel, AudioDevicesVisibility, HomePath, AGSPath } from "../common/Variables";
import { WindowTopRightCorner } from "../common/Corners";
import { ThemeMode, CurrentTheme, WallpaperPath } from "./ThemeMode";
import { exec, execAsync } from "astal/process";
import { ThemesButtons } from "./ThemesButtons";
import { getThemeColorsAndWallpaper } from "./ThemesButtons"
import { OnClickCloseTRButton } from "./BarButtons";
import Wp from "gi://AstalWp"

const { START, CENTER, END } = Gtk.Align

const speaker = Wp.get_default()?.audio.defaultSpeaker!

function ShowDevices() {
    DevicesLabel.set(DevicesLabel.get() == '' ? '' : '')
    AudioDevicesVisibility.set(AudioDevicesVisibility.get() ? false : true)
}

function Device({ dev }: { dev: any }) {
    return (
        <button
            className={bind(speaker, "id").as(id => id === dev.id ? "active" : "inactive")}
            onClick={() => {
                dev.is_default = true;
            }}
            cursor="pointer"
            hexpand
        >
            <box spacing={8}>
                <box>
                    <label 
                        label={dev.description}
                        wrap
                        truncate
                        xalign={0}
                    />
                </box>
                <label 
                    label={bind(dev, "volume").as(
                        vol => `${Math.round(vol * 100)}%`
                    )}
                    className="DeviceVolume"
                />
            </box>
        </button>
    );
}

const AudioSettings = () => {
    const audio = Wp.get_default()!.audio;

    return <box className="AudioSettings" vertical>
        <box>
            <box className="AudioSlider">
                <icon icon={bind(speaker, "volumeIcon")} />
                
                <slider
                    hexpand
                    onDragged={({ value }) => speaker.volume = value}
                    value={bind(speaker, "volume")}
                />
                
            </box>
            <button 
                className={"DevicesButton"}
                label={bind(DevicesLabel)}
                onClick={ShowDevices}
            />            
        </box>
        <revealer
            revealChild={bind(AudioDevicesVisibility)}
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transitionDuration={200}>
            <box className="DevicesContainer" vertical spacing={6}>
                {
                    bind(audio, "speakers").as( spk => spk
                        .map(dev => {
                            return <Device dev={dev}/>
                        }
                    ))
                }
            </box>
        </revealer>
    </box>
}

const Power = () => {
    return (
        <box className="PowerButtonsContainer" homogeneous>
            <centerbox className="PowerButtons">
                <button label='' halign={START} onClick={()=>{execAsync(["bash", "-c", 'hyprctl dispatch exit'])}}/>
                <button label='' halign={CENTER} onClick={()=>{exec("bash -c reboot");}}/>
                <button label='󰤆' halign={END} onClick={()=>{execAsync(["bash", "-c", 'shutdown now'])}}/>
            </centerbox>
        </box>        
    )
}

async function updateAgsTemplate(){
    let template: string = "";
    if (ThemeMode.get() == 'light') {
        template = `$accent_color: {{colors.primary.default.hex}};
            $widget_secondary_bg_color: {{colors.secondary_fixed_dim.default.hex}};
            $widget_bg_color: {{colors.primary_fixed_dim.default.hex}};
            $hover_bg_color: {{colors.primary_container.default.hex}};
            $bg_color: {{colors.background.default.hex}};
            $error: red;`;
    } else {
        template = `$accent_color: {{colors.primary.default.hex}};
            $widget_secondary_bg_color: {{colors.secondary_container.default.hex}};
            $widget_bg_color: {{colors.surface_bright.default.hex}};
            $hover_bg_color: {{colors.surface_container.default.hex}};
            $bg_color: {{colors.background.default.hex}};
            $error: red;`;
    }

    try {
        
        const result = await execAsync(HomePath.get() + `/.config/ags/scripts/update_ags_colors_template.sh "${template}"`);
        console.log("Ags/Astal template updated: ", result);
    } catch (error) {
        console.error("Error while updating update_ags_colors_template.sh:", error);
    }
}

function generateSCSS(theme:any) {
    return `
        $accent_color: ${theme.colors.accent_color};
        $widget_secondary_bg_color: ${theme.colors.widget_secondary_bg_color};
        $widget_bg_color: ${theme.colors.widget_bg_color};
        $hover_bg_color: ${theme.colors.hover_bg_color};
        $bg_color: ${theme.colors.bg_color};
        $error: red;
    `;
}

async function updateColorsFile(theme:any) {
    const scssContent = generateSCSS(theme);
    
    try {
        await writeFile(AGSPath.get() + "/colors.scss", scssContent);
        console.log("Archivo de cambio de tema colors.scss actualizado correctamente.");
    } catch (error) {
        console.error("Error actualizando el archivo colors.scss:", error);
    }
}

function ChangeOnlyWallpaper() {
    OnClickCloseTRButton();
    
    execAsync(HomePath.get() + '/.config/ags/scripts/only_wallpaper.sh')
        .then(out => {
            WallpaperPath.set(out);
            console.log("Wallpaper cambiado a " + out)
            execAsync(`notify-send --app-name="Settings" "Wallpaper" "Wallpaper applied."`);
        })
        .catch(err => {
            console.error("Error ejecutando el script cambiar wallpaper:", err);
            //execAsync(`notify-send -u critical --app-name="Settings" "Wallpaper" "Error while applying wallpaper."`);
        }
    );
}

function ChangeWallpaperAndTheme() {
    OnClickCloseTRButton();
    updateAgsTemplate();
    execAsync(HomePath.get() + '/.config/ags/scripts/wallpaper.sh ' + ThemeMode.get())
        .then(out => {
            const outParts = out.trim().split("\n");
    
            if (outParts[0] === "ok" && outParts.length > 1) {
                WallpaperPath.set(outParts[1].trim());
                CurrentTheme.set('custom');
                console.log("Colores generados y Wallpaper cambiado a " + outParts[1].trim())
                execAsync(`notify-send --app-name="Settings" "Theme" "Wallpaper applied and theme regenerated."`);
            } else {
                console.log("Error: No se pudo establecer la ruta del wallpaper o el comando falló");
            }
        })
        .catch(err => {
            console.error("Error ejecutando el script cambiar wallpaper y generar colores:", err);
            //execAsync(`notify-send -u critical --app-name="Settings" "Theme" "Error while applying wallpaper or generating theme."`);
        }
    );
        
}

function RandomWallpaper() {
    execAsync(HomePath.get() + '/.config/ags/scripts/random_wallpaper.sh ' + WallpaperPath.get())
        .then(out => {    
            WallpaperPath.set(out);
            console.log("Wallpaper randomizado  a " + out)
        })
        .catch(err => {
            console.error("Error ejecutando el script randomizar wallpaper:", err);
        }
    );
}

async function ChangeThemeModeOnCustomTheme() {
    execAsync(HomePath.get() + '/.config/ags/scripts/wallpaper.sh ' + ThemeMode.get() + ' ' + WallpaperPath.get())
        .then(out => {
            const outParts = out.trim().split("\n");

            if (outParts[0] === "ok" && outParts.length > 1) {
                WallpaperPath.set(outParts[1].trim());
            } else {
                console.log("Error: No se pudo establecer la ruta del wallpaper o el comando falló");
            }
        })
        .catch(err => {
            console.error("Error ejecutando el script para generar custom theme mode:", err);
        }
    );
}
async function ChangeOnlyThemeMode() {
    ThemeMode.set(ThemeMode.get() == 'light' ? 'dark' : 'light');
    exec(`gsettings set org.gnome.desktop.interface color-scheme 'prefer-${ThemeMode.get()}'`);
    updateAgsTemplate();

    if (CurrentTheme.get() == 'custom') {        
        ChangeThemeModeOnCustomTheme();
    } else {
        const themeData = await getThemeColorsAndWallpaper(CurrentTheme.get(), ThemeMode.get());

        const colorPromise = execAsync(`matugen color hex ${themeData!.colors.accent_color.replace('#', '')} -m "${ThemeMode.get()}"`);
        
        await Promise.all([colorPromise]);

        await updateColorsFile(themeData);

        console.log(`Cambio de tema ${CurrentTheme.get()} aplicado correctamente`);
        WallpaperPath.set(themeData!.wallpaper);
    }
}

async function ChangeThemeModeAndWallpaper() {
    ThemeMode.set(ThemeMode.get() == 'light' ? 'dark' : 'light');
    exec(`gsettings set org.gnome.desktop.interface color-scheme 'prefer-${ThemeMode.get()}'`);
    updateAgsTemplate();
    if (CurrentTheme.get() == 'custom') {
        ChangeThemeModeOnCustomTheme();
    } else {
        const themeData = await getThemeColorsAndWallpaper(CurrentTheme.get(), ThemeMode.get());

        const wallpaperPromise = execAsync(`swww img ${themeData!.wallpaper} --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 60`);
        const colorPromise = execAsync(`matugen color hex ${themeData!.colors.accent_color.replace('#', '')} -m "${ThemeMode.get()}"`);
        
        await Promise.all([wallpaperPromise, colorPromise]);

        await updateColorsFile(themeData);

        console.log(`Cambio de tema ${CurrentTheme.get()} aplicado correctamente`);
        WallpaperPath.set(themeData!.wallpaper);
    }
}

const ThemeSettings = () => {
    return <box className="ThemeSettings" vertical>

        <box className="Title" homogeneous>
            <label label="Theme Settings" halign={CENTER}/>
        </box>

        <box className="Content" vertical>

            <box className={"WallControl"} spacing={34}>

                <box className={"Border"} homogeneous>
                    <box className={"ColorsContainer"} spacing={8} homogeneous={false}>
                        <button
                            className={"AccentColor"}
                        />
                        <button
                            className={"WidgetSecondaryBgColor"}
                        />
                        <button
                            className={"WidgetBgColor"}
                        />
                        <button
                            className={"HoverBgColor"}
                        />
                        <button
                            className={"BgColor"}
                        />
                    </box>
                </box>

                <box spacing={10}>
                    <button
                        onClick={
                            (self, event) => {
                                if (event.button == Astal.MouseButton.PRIMARY) {
                                    ChangeOnlyWallpaper();
                                } else if (event.button == Astal.MouseButton.SECONDARY) {
                                    ChangeWallpaperAndTheme();
                                }
                            }
                        }
                        label={'󰸉'}
                        tooltipText={"Change wallpaper / Change wallpaper and regenerate colors"}
                    />
                    <button
                        onClick={
                            (self, event) => {
                                if (event.button == Astal.MouseButton.PRIMARY) {
                                    ChangeOnlyThemeMode();
                                } else if (event.button == Astal.MouseButton.SECONDARY) {
                                    ChangeThemeModeAndWallpaper();
                                }
                            }
                        }
                        tooltipText={"Change theme version / Change theme version and apply theme wallpaper"}
                        label={ThemeMode().as((tm:string) => tm === "light" ? '󰖔' : '' )}
                    />
                    <button
                        onClick={RandomWallpaper}
                        label={''}
                    />
                </box>
            </box>

            <box className={"Themes"} homogeneous>
                <ThemesButtons />
            </box>
            
        </box>

    </box>
}
export default function () {
    return (
        <box>
            <box className={bind(WindowCornerStyle)}>
                <WindowTopRightCorner />
            </box>
            <box className="Settings" vertical>
                <AudioSettings />
                <ThemeSettings />
                <Power />
            </box>
        </box>
    );
}