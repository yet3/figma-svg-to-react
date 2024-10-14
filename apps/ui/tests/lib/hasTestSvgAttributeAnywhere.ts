import type { Node } from "svg-parser";

export const hasTestSvgAttributeAnywhere = (
	node: Node | string,
	attr: string,
): boolean => {
	if (typeof node !== "object") return false;

	if (node.type === "element") {
		if (Object.hasOwn(node.properties, attr)) {
			return true;
		}

		for (const childNode of node.children) {
			if (hasTestSvgAttributeAnywhere(childNode, attr)) {
				return true;
			}
		}
	}

	return false;
};
