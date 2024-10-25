import type { ISvgoPluginFn } from "@shared/types";
import { getRootNodes } from "../getRootNodes";

export const iconMode: ISvgoPluginFn = ({ genOptions, svgValues }) => ({
	name: "icon-mode",
	fn: () => ({
		root: {
			enter: (root) => {
				if (!genOptions.iconMode) return;
				const svgNodes = getRootNodes(root);
				for (const svgNode of svgNodes) {
					if (!genOptions.removeWidth && !Object.hasOwn(svgValues, "width")) {
						svgNode.attributes.width = "1em";
					}
					if (!genOptions.removeHeight && !Object.hasOwn(svgValues, "height")) {
						svgNode.attributes.height = "1em";
					}
				}
			},
		},
	}),
});
