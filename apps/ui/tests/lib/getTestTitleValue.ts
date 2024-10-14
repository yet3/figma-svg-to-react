import type { ElementNode } from "svg-parser";

export const getTestTitleElement = (svgEl: ElementNode): ElementNode | null => {
	const titleNode = svgEl.children.find(
		(e) =>
			typeof e === "object" && e.type === "element" && e.tagName === "title",
	) as ElementNode;

	return titleNode ?? null;
};

export const getTestTitleValue = (svgEl: ElementNode): string | null => {
	const titleNode =
		svgEl.tagName === "title" ? svgEl : getTestTitleElement(svgEl);
	if (!titleNode) return null;

	const titleTextNode = titleNode.children.find(
		(e) => typeof e === "object" && e.type === "text",
	);

	if (!titleTextNode) return null;

	return (titleTextNode.value as string) ?? null;
};
