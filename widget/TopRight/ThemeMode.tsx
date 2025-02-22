import { readFile, writeFile, monitorFile } from "astal/file";
import { Variable } from "astal";
import { AGSPath } from "../common/Variables";

const filePath = AGSPath.get() + "/theme_mode.txt";

export const ThemeMode = Variable("");
export const CurrentTheme = Variable("");
export const WallpaperPath = Variable("");

function saveThemeMode() {
    writeFile(filePath, `${CurrentTheme.get()}\n${ThemeMode.get()}\n${WallpaperPath.get()}`);
}

function loadThemeMode() {
    try {
        const lines = readFile(filePath).trim().split("\n");
        if (lines.length > 0) {
            CurrentTheme.set(lines[0]);            
        }
        if (lines.length > 1 && (lines[1] === "dark" || lines[1] === "light")) {
            ThemeMode.set(lines[1]);            
        } else {
            console.log("Invalid theme mode.");
        }
        if (lines.length > 2) {
            WallpaperPath.set(lines[2]);
        }
    } catch (error) {
        console.log("Error while loading theme mode from .txt");
    }
}

monitorFile(filePath, () => {
    loadThemeMode();
});

ThemeMode.subscribe(saveThemeMode);
CurrentTheme.subscribe(saveThemeMode);
WallpaperPath.subscribe(saveThemeMode);

loadThemeMode();
