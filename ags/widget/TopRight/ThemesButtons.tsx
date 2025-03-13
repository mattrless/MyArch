import { Gtk, Astal } from "astal/gtk3";
import { readFile, writeFile, monitorFile } from "astal/file";
import { Variable } from "astal";
import { AGSPath, HomePath } from "../common/Variables";
import { bind } from "astal/binding";
import { ThemeMode, CurrentTheme, WallpaperPath } from "./ThemeMode";
import { exec, execAsync } from "astal/process";

const themesPath = AGSPath.get() + "/themes.json";
const { START, CENTER, END } = Gtk.Align

export const Themes = Variable<Record<string, any>>({});

// Cargar y validar temas
function loadThemes() {
    try {
        const json = readFile(themesPath);
        const newData = JSON.parse(json);
        const currentData = Themes.get();
        
        // Evitar actualizaciones innecesarias
        if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
            Themes.set(newData);
        }
    } catch (error) {
        console.error("Error loading themes:", error);
        // Puedes agregar notificaciones de error aquí
    }
}

// Sincronización automática de cambios externos
monitorFile(themesPath, () => {
    loadThemes();
});

// Carga inicial
loadThemes();

export function getThemeColorsAndWallpaper(themeName: string, mode: string) {
    const themeConfig = Themes.get(); // Obtenemos la configuración de todos los temas

    if (themeConfig && themeConfig[themeName]) {
        const selectedTheme = themeConfig[themeName];
        if (selectedTheme[mode]) {
            const themeData = selectedTheme[mode];
            return {
                wallpaper: themeData.wallpaper,
                colors: {
                    accent_color: themeData.accent_color,
                    widget_secondary_bg_color: themeData.widget_secondary_bg_color,
                    widget_bg_color: themeData.widget_bg_color,
                    hover_bg_color: themeData.hover_bg_color,
                    bg_color: themeData.bg_color
                }
            };
        } else {
            console.error(`Modo ${mode} no encontrado para el tema ${themeName}`);
        }
    } else {
        console.error(`Tema ${themeName} no encontrado`);
    }
    
    return null;
}

function generateSCSS(themeConfig:any) {
    return `
        $accent_color: ${themeConfig.accent_color};
        $widget_secondary_bg_color: ${themeConfig.widget_secondary_bg_color};
        $widget_bg_color: ${themeConfig.widget_bg_color};
        $hover_bg_color: ${themeConfig.hover_bg_color};
        $bg_color: ${themeConfig.bg_color};
        $error: red;  // El color de error siempre será rojo
    `;
}

async function updateColorsFile(themeConfig:any) {
    const scssContent = generateSCSS(themeConfig);
    
    try {
        await writeFile(AGSPath.get() + "/colors.scss", scssContent);
        console.log("Archivo colors.scss actualizado correctamente.");
    } catch (error) {
        console.error("Error actualizando el archivo colors.scss:", error);
    }
}

async function ApplyTheme (config: any, themeName: any) {
    const themeConfig = config[ThemeMode.get()];
    if (themeConfig) {
        try {
            await execAsync(`matugen color hex ${themeConfig.accent_color.replace('#', '')} -m "${ThemeMode.get()}"`);
            await updateColorsFile(themeConfig);

            console.log(`Tema ${themeName} aplicado correctamente`);
            CurrentTheme.set(themeName);                                    
        } catch (error) {
            console.error("Error aplicando tema:", error);
        }
    }
}

async function ApplyThemeAndWallpaper (config: any, themeName: any) {
    const themeConfig = config[ThemeMode.get()];
    if (themeConfig) {
        try {
            execAsync(`swww img ${themeConfig.wallpaper} --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 60`);
            await execAsync(`matugen color hex ${themeConfig.accent_color.replace('#', '')} -m "${ThemeMode.get()}"`);
            await updateColorsFile(themeConfig);

            console.log(`Tema ${themeName} aplicado correctamente`);
            CurrentTheme.set(themeName);
            WallpaperPath.set(themeConfig.wallpaper);
        } catch (error) {
            console.error("Error aplicando tema:", error);
        }
    }
}

function ThemeButton({ themeName, config }:{themeName:any, config:any}) {
    return (
        <button
            className={bind(CurrentTheme).as((current) => current === themeName ? "ActiveTheme" : "ThemeButton")}

            onClick={
                (self, event) => {
                    if (event.button == Astal.MouseButton.PRIMARY) {
                        ApplyTheme(config, themeName);
                    } else if (event.button == Astal.MouseButton.SECONDARY) {
                        ApplyThemeAndWallpaper(config, themeName);
                    }
                }
            }
            tooltipText={"Apply theme colors / Apply theme with wallpaper"}
        >
            <box spacing={6} homogeneous>
                {bind(ThemeMode).as((mode) => (
                    <label
                        className="item"
                        wrap
                        truncate
                        xalign={0}
                        label={`${themeName} - ${mode}`}
                    />
                ))}

                {bind(ThemeMode).as((mode) => {
                    const themeConfig = config[mode];

                    return (
                        <box spacing={4} halign={END}>
                            <label label="" css={`color: ${themeConfig.accent_color};`} />
                            <label label="" css={`color: ${themeConfig.widget_secondary_bg_color};`} />
                            <label label="" css={`color: ${themeConfig.widget_bg_color};`} />
                            <label label="" css={`color: ${themeConfig.hover_bg_color};`} />
                            <label label="" css={`color: ${themeConfig.bg_color};`} />
                        </box>
                    );
                })}
            </box>
        </button>
    );
}


export const ThemesButtons = () => {
    return (
        <scrollable>
            <box spacing={6} vertical>
                {bind(Themes).as((themes) =>
                    Object.entries(themes).map(([themeName, config]) => (
                        <ThemeButton themeName={themeName} config={config} />
                    ))
                )}
            </box>
        </scrollable>
    );
};
