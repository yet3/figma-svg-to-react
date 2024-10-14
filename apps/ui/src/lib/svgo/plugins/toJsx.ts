import { FrameworkEnum, type ISvgoPluginFn } from "@shared/types";
import {
	getReactNativeSvgElement,
	getReactSvgAttribiute,
} from "../reactMappings";

export const toJsx: ISvgoPluginFn = (ctx) => {
	if (!ctx.isReact) return null;

	const isReactNative = ctx.framework === FrameworkEnum.REACT_NATIVE;

	const removeAttribiutes: Set<string> = new Set();
	const usedReactNativeElements: Set<string> = new Set();
	const removedReactNativeElements: Set<string> = new Set();

	return {
		name: "to-jsx",
		fn: () => {
			return {
				root: {
					exit: () => {
						ctx.updateTransformationInfo({
							removedAttributes: [...removeAttribiutes],
							removedElements: [...removedReactNativeElements],
							usedReactNativeElements: [...usedReactNativeElements],
						});
					},
				},
				element: {
					exit: (node, parent) => {
						if (node.type !== "element") return;

						for (const attrName in node.attributes) {
							const mappedAttr = getReactSvgAttribiute(attrName);

							if (mappedAttr) {
								if (attrName !== mappedAttr) {
									node.attributes[mappedAttr] = node.attributes[attrName];
									delete node.attributes[attrName];
								}
							} else {
								delete node.attributes[attrName];
								removeAttribiutes.add(attrName);
							}
						}

						if (isReactNative) {
							const mappedElName = getReactNativeSvgElement(node.name);
							if (mappedElName) {
								usedReactNativeElements.add(mappedElName);
								node.name = mappedElName;
							} else {
								removedReactNativeElements.add(node.name);
								parent.children = parent.children.filter(
									(child) => child !== node,
								);
							}
						}
					},
				},
			};
		},
	};
};
