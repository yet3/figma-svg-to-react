import { SVG_PLACEHOLDERS } from "@lib";
import type { ISvgoPluginFn } from "@shared/types";
import { getRootNodes } from "../getRootNodes";

export const insertPlaceholders: ISvgoPluginFn = () => ({
	name: "insert-placeholders",
	fn: () => ({
		root: {
			enter: (root) => {
				for (const svgNode of getRootNodes(root)) {
					svgNode.attributes[SVG_PLACEHOLDERS.ATTRS.SPREAD_PROPS] = "";
					svgNode.attributes[SVG_PLACEHOLDERS.ATTRS.REF] = "";
				}
			},
		},
	}),
});
