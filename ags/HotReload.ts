import { App } from "astal/gtk3";
import { execAsync, monitorFile } from "astal";

/* CSS Hot Reload */
async function monitorStyle() {
	const pathsToMonitor = [
        './style.scss',
		'./colors.scss'
	];

	const mainScss = `./style.scss`;
	const css = `/tmp/style.css`;

	let isApplying = false;

	async function transpileAndApply() {
		if (isApplying) return;
		isApplying = true;

		try {
			await execAsync(`sass ${mainScss} ${css}`);
			App.apply_css(css, true);
			print("CSS applied!");
		} catch (error) {
			print("Error compilying SCSS:", error);
			execAsync(`notify-send -u critical "Error compiling SCSS" "${error}"`);
		} finally {
			isApplying = false;
		}
	}

	pathsToMonitor.forEach((path) => monitorFile(path, transpileAndApply));

	return transpileAndApply();
}

export default monitorStyle();
