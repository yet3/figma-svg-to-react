import type { XastNode } from "svgo/lib/types";
import { REACT_NATIVE_ELEMENTS_MAPPINGS } from "./reactMappings";

export const isSvgElement = (node: XastNode) => {
	return (
		node.type === "element" &&
		["svg", REACT_NATIVE_ELEMENTS_MAPPINGS.svg].includes(node.name)
	);
};
