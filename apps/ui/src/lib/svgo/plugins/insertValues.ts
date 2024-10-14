import type {
	IDefaultSvgValues,
	ISvgValues,
	ISvgoCtx,
	ISvgoPluginFn,
} from "@shared/types";
import type { XastElement, XastText } from "svgo/lib/types";
import { getRootNodes } from "../getRootNodes";

const handleTitle = (
	{ svgValues: values }: ISvgoCtx,
	svgNode: XastElement,
	defaultValues: Partial<IDefaultSvgValues>,
) => {
	const titleElIdx = svgNode.children.findIndex(
		(e) => e.type === "element" && e.name === "title",
	);

	// delete node
	if (titleElIdx >= 0) {
		const titleEl = svgNode.children.splice(titleElIdx, 1)[0] as XastElement;
		const textEl = titleEl.children[0] as XastText;
		if (textEl?.type === "text") {
			if (!Object.hasOwn(defaultValues, "title")) {
				defaultValues.title = textEl.value;
			}
		}
	}

	const hasTitle = !!defaultValues.title;
	if (values.title || hasTitle) {
		if (!Object.hasOwn(defaultValues, "title")) {
			defaultValues.title = "";
		}

		svgNode.children.unshift({
			type: "element",
			name: "title",
			attributes: {},
			children: [
				{
					type: "text",
					value: values.title ?? defaultValues.title ?? "",
				},
			],
		});
	}
};

export const insertValues: ISvgoPluginFn = (ctx) => {
	const values = ctx.svgValues;
	const defaultValues: Partial<IDefaultSvgValues> = {};

	return {
		name: "insert-values",
		fn: () => ({
			root: {
				enter: (root) => {
					for (const svgNode of getRootNodes(root)) {
						handleTitle(ctx, svgNode, defaultValues);

						const setAttr = (key: keyof ISvgValues) => {
							if (
								Object.hasOwn(svgNode.attributes, key) &&
								!Object.hasOwn(defaultValues, key)
							) {
								defaultValues[key] = svgNode.attributes[key];
							}

							if (Object.hasOwn(values, key)) {
								if (values[key]) {
									svgNode.attributes[key] = values[key];
								} else {
									delete svgNode.attributes[key];
								}
							}
						};

						setAttr("width");
						setAttr("height");
						setAttr("viewBox");
					}
				},
				exit: () => {
					ctx.updateDefaultValues(defaultValues);
				},
			},
		}),
	};
};
