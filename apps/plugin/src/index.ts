import { OPTIONS_VERSION } from "@shared/lib";
import {
	FrameworkEnum,
	type IExportSvg,
	type IFrameworkGenOptions,
	type IPluginMessage,
	type IPluginMessageInit,
	PluginMessageKind,
} from "@shared/types";

const SELECTED_FRAMEWORK_STORAGE_KEY = "selected_framework";
const GEN_OPTIONS_STORAGE_KEY = "genertaion_options";

figma.on("run", async () => {
	const nodes = figma.currentPage.selection;

	if (nodes.length === 0) {
		figma.notify("Error: At least 1 node has to be selected");
		figma.closePlugin();
		return;
	}

	const loadingNotification = figma.notify("React to SVG: Starting...", {
		timeout: 60000,
	});

	figma.showUI(__html__, { width: 600, height: 700 });

	const promises: Promise<IExportSvg>[] = [];

	for (const node of nodes) {
		if (typeof node.exportAsync === "function") {
			promises.push(
				new Promise((resolve, reject) => {
					node
						.exportAsync({ format: "SVG", svgIdAttribute: true })
						.then((bytes) => {
							resolve({
								id: Math.random().toString(),
								nodeName: node.name,
								bytes: new Uint8Array(bytes),
							});
						})
						.catch(reject);
				}),
			);
		}
	}

	try {
		const svgs = await Promise.all(promises);

		const storedGenOptions = await figma.clientStorage.getAsync(
			GEN_OPTIONS_STORAGE_KEY,
		);
		const framework = await figma.clientStorage.getAsync(
			SELECTED_FRAMEWORK_STORAGE_KEY,
		);

		let genOptions: Partial<IFrameworkGenOptions> = {};
		if (
			storedGenOptions?.version === OPTIONS_VERSION &&
			storedGenOptions?.genOptions
		) {
			genOptions = storedGenOptions.genOptions;
		}

		figma.ui.postMessage({
			kind: PluginMessageKind.INIT,
			framework: framework ?? FrameworkEnum.REACT,
			svgs: svgs,
			genOptions: genOptions,
		} as IPluginMessageInit);
	} catch (e) {
		console.log(e);
		figma.notify("There was an error during export!");
		figma.closePlugin();
	} finally {
		loadingNotification.cancel();
	}
});

figma.ui.onmessage = (msg: IPluginMessage) => {
	switch (msg.kind) {
		case PluginMessageKind.CLOSE_PLUGIN: {
			figma.closePlugin();
			break;
		}
		case PluginMessageKind.NOTIFY: {
			figma.notify(msg.msg);
			break;
		}
		case PluginMessageKind.SAVE_SELECTED_FRAMEWORK: {
			figma.clientStorage.setAsync(
				SELECTED_FRAMEWORK_STORAGE_KEY,
				msg.framework,
			);
			break;
		}
		case PluginMessageKind.SAVE_GEN_OPTIONS: {
			figma.clientStorage.setAsync(GEN_OPTIONS_STORAGE_KEY, {
				version: OPTIONS_VERSION,
				genOptions: msg.genOptions,
			});
			break;
		}
	}
};
