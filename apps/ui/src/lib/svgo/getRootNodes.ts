import type { XastElement, XastRoot } from "svgo/lib/types";
import { isSvgElement } from "./isSvgElement";

export const getRootNodes = (root: XastRoot): XastElement[] => {
	return root.children.filter((node) => isSvgElement(node)) as XastElement[];
};
