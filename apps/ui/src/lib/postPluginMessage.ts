import type { IPluginMessage } from "@shared/types";

export const postPluginMessage = (msg: IPluginMessage) => {
	parent.postMessage({ pluginMessage: msg }, "*");
};
