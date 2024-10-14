import type { ISvgoPluginFn } from "@shared/types";
import { isSvgElement } from "../isSvgElement";

export const removeAttributes: ISvgoPluginFn = ({ genOptions, svgValues }) => ({
	name: "remove-attributes",
	fn: () => ({
		element: {
			enter: (node) => {
				if (isSvgElement(node)) {
					if (genOptions.removeWidth && !Object.hasOwn(svgValues, "width")) {
						// biome-ignore lint/performance/noDelete:
						delete node.attributes.width;
					}
					if (genOptions.removeHeight && !Object.hasOwn(svgValues, "height")) {
						// biome-ignore lint/performance/noDelete:
						delete node.attributes.height;
					}
				}

				if (genOptions.removeAllFillAttributes) {
					// biome-ignore lint/performance/noDelete:
					delete node.attributes.fill;
				}
				if (genOptions.removeAllStrokeAttributes) {
					// biome-ignore lint/performance/noDelete:
					delete node.attributes.stroke;
				}
			},
		},
	}),
});
