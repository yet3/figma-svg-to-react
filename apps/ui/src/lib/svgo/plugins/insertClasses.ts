import type { ISvgoPluginFn } from "@shared/types";
import type { XastChild, XastElement } from "svgo/lib/types";
import { getRootNodes } from "../getRootNodes";
import { parseClassAttr } from "../parseClassAttr";

export const insertClasses: ISvgoPluginFn = ({ genOptions, isReact }) => {
	const goThroughChildren = (node: XastChild, accClass = "") => {
		if (node.type !== "element") return;

		if (node.attributes.id) {
			if (!genOptions.bemClasses) {
				setClassAttr(node, parseClassAttr(node.attributes.id));
			} else {
				// biome-ignore lint lint/style/noParameterAssign:
				accClass += `${accClass.length > 0 ? "__" : ""}${parseClassAttr(node.attributes.id)}`;
				setClassAttr(node, accClass);
			}
			// biome-ignore lint lint/performance/noDelete:
			delete node.attributes.id;

			for (const child of node.children) {
				goThroughChildren(child, accClass);
			}
		}
	};

	const setClassAttr = (node: XastElement, value: string) => {
		node.attributes[isReact ? "className" : "class"] = value;
	};

	return {
		name: "insert-classes",
		fn: () => ({
			root: {
				enter: (root) => {
					if (!genOptions.nodesNamesToClasses) {
						return;
					}

					const svgNodes = getRootNodes(root);
					for (const svgNode of svgNodes) {
						let baseClass = "";
						if (svgNode.children.length > 0) {
							const node = svgNode.children.filter(
								(e) => e.type === "element" && e.name !== "title",
							)[0] as XastElement | null;

							if (node?.attributes.id) {
								baseClass = parseClassAttr(node.attributes.id);

								setClassAttr(svgNode, baseClass);
								if (node.name === "g") {
									svgNode.children = node.children;
								} else {
									// biome-ignore lint lint/performance/noDelete:
									delete node.attributes.id;
								}
							}

							if (!genOptions.classOnlyOnSvg) {
								for (const child of svgNode.children) {
									goThroughChildren(child, baseClass);
								}
							}
						}
					}
				},
			},
		}),
	};
};
