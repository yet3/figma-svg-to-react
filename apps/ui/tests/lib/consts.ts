import type { IOriginalSvg } from "@shared/types";

export const TEST_SVG_TITLE = "Test svg title";
export const TEST_SVG_WIDTH = 144;
export const TEST_SVG_HEIGHT = 144;
export const TEST_SVG_VIEWBOX = "0 0 144 144";

export const TEST_SVG_GROUP_ID = "Group 1";
export const TEST_SVG_GROUP_ID_PARSED = "Group1";
export const TEST_SVG_RECT_1_ID = "1Rectangle_14";
export const TEST_SVG_RECT_1_ID_PARSED = "Rectangle_14";
export const TEST_SVG_RECT_2_ID = "Rectangle-17";
export const TEST_SVG_RECT_2_ID_PARSED = "Rectangle-17";

export const TEST_SVGS = {
	SIMPLE_RECT: `<svg width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" viewBox="${TEST_SVG_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="144" height="144" fill="#FF00F2" stroke="red" /></svg>`,
	SIMPLE_RECT_OPTIMIZED: `<svg xmlns="http://www.w3.org/2000/svg" width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" fill="none" viewBox="${TEST_SVG_VIEWBOX}" SPP_SPREAD_PROPS="" SPP_REF=""><path fill="#FF00F2" stroke="red" d="M0 0h144v144H0z"/></svg>`,

	SIMPLE_RECT_WITH_TITLE: `<svg width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" viewBox="${TEST_SVG_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg"><title>${TEST_SVG_TITLE}</title><rect width="144" height="144" fill="#FF00F2"/></svg>`,
	SIMPLE_RECT_EMPTY_TITLE: `<svg width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" viewBox="${TEST_SVG_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg"><title></title><rect width="144" height="144" fill="#FF00F2"/></svg>`,

	GROUP_2_RECTS_WITH_IDS: `<svg width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" viewBox="${TEST_SVG_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="${TEST_SVG_GROUP_ID}"><rect id="${TEST_SVG_RECT_1_ID}" width="144" height="144" fill="#FF00F2"/><rect id="${TEST_SVG_RECT_2_ID}" width="144" height="144" fill="#00FFF2"/></g></svg>`,
	RECTS_WITH_ID: `<svg width="${TEST_SVG_WIDTH}" height="${TEST_SVG_HEIGHT}" viewBox="${TEST_SVG_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect id="${TEST_SVG_RECT_1_ID}" width="144" height="144" fill="#FF00F2"/></svg>`,
};

export const OG_SVG_ID = "og-svg";
export const OG_SVG_NODE_NAME = "my-icon";
export const OG_SVG_DATA = TEST_SVGS.SIMPLE_RECT;

export const makeTestOgSvg = (): IOriginalSvg => ({
	id: OG_SVG_ID,
	nodeName: OG_SVG_NODE_NAME,
	data: OG_SVG_DATA,
});
