import type { ISvgoPluginFn } from "@shared/types";

export const removeUnknownsAndDefaults: ISvgoPluginFn = ({ isReact }) => ({
	name: "removeUnknownsAndDefaults",
	params: {
		unknownContent: !isReact,
		unknownAttrs: !isReact,
	},
});
