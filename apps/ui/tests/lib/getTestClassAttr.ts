import { REACT_FRAMEWORKS } from "@shared/lib";
import type { FrameworkEnum } from "@shared/types";
import type { ElementNode } from "svg-parser";

export const getTestClassAttr = (
	node: ElementNode,
	framework: FrameworkEnum,
) => {
	const attrName = REACT_FRAMEWORKS.includes(framework) ? "className" : "class";

	return node.properties[attrName];
};
