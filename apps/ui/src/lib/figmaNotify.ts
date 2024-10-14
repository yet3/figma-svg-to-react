import { PluginMessageKind } from "@shared/types";
import { postPluginMessage } from "./postPluginMessage";

export const figmaNotify = (msg: string) => {
	postPluginMessage({
		kind: PluginMessageKind.NOTIFY,
		msg,
	});
};

export const figmaNotifyError = (msg: string, err?: unknown) => {
	let errMsg = "";

	if (err) {
		if (err instanceof Error) {
			errMsg = err.message;
		} else if (typeof err.toString === "function") {
			errMsg = err.toString();
		}
	}

	postPluginMessage({
		kind: PluginMessageKind.NOTIFY,
		msg: `${msg}: ${err}`,
	});
};
