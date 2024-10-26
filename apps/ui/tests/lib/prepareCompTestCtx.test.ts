import { FrameworkEnum } from "@shared/types";
import type { ElementNode } from "svg-parser";
import { describe, expect, test } from "vitest";
import {
	TEST_SVGS,
	TEST_SVG_GROUP_ID,
	TEST_SVG_HEIGHT,
	TEST_SVG_RECT_1_ID,
	TEST_SVG_RECT_2_ID,
	TEST_SVG_TITLE,
	TEST_SVG_VIEWBOX,
	TEST_SVG_WIDTH,
} from "../lib/consts";
import {
	type ICompTestCtx,
	prepareCompTestCtx,
} from "../lib/prepareCompTestCtx";
import { getTestTitleElement, getTestTitleValue } from "./getTestTitleValue";

describe("test util: prepare component test context", () => {
	interface ITestOpts {
		name: string;
		svgCode: string;
		additionalTests?: Array<(ctx: ICompTestCtx) => void>;
	}
	const testSVG = ({ name, svgCode, additionalTests }: ITestOpts) => {
		for (const framework of Object.values(FrameworkEnum)) {
			test(`[${framework}] ${name} should have properties`, async () => {
				const ctx = await prepareCompTestCtx({
					svgCode,
					framework,
					genOptions: {},
				});
				const { beforeSvgEl } = ctx;

				expect(beforeSvgEl.properties).toHaveProperty("width");
				expect(beforeSvgEl.properties).toHaveProperty("height");
				expect(beforeSvgEl.properties).toHaveProperty("viewBox");
				expect(beforeSvgEl.properties.width).toBe(TEST_SVG_WIDTH);
				expect(beforeSvgEl.properties.height).toBe(TEST_SVG_HEIGHT);
				expect(beforeSvgEl.properties.viewBox).toBe(TEST_SVG_VIEWBOX);

				if (additionalTests) {
					for (const execTests of additionalTests) {
						execTests(ctx);
					}
				}
			});
		}
	};

	const testNoTitle = ({ beforeSvgEl }: ICompTestCtx) => {
		expect(getTestTitleElement(beforeSvgEl)).toBeNull();
	};

	const testWithTitle = ({ beforeSvgEl }: ICompTestCtx) => {
		expect(getTestTitleElement(beforeSvgEl)).toBeDefined();
		expect(getTestTitleValue(beforeSvgEl)).toBe(TEST_SVG_TITLE);
	};

	const testWithEmptyTitle = ({ beforeSvgEl }: ICompTestCtx) => {
		expect(getTestTitleElement(beforeSvgEl)).toBeDefined();
		expect(getTestTitleValue(beforeSvgEl)).toBeNull();
	};

	testSVG({
		name: "SIMPLE_RECT",
		svgCode: TEST_SVGS.SIMPLE_RECT,
		additionalTests: [testNoTitle],
	});

	testSVG({
		name: "SIMPLE_RECT_OPTIMIZED",
		svgCode: TEST_SVGS.SIMPLE_RECT_OPTIMIZED,
		additionalTests: [testNoTitle],
	});

	testSVG({
		name: "SIMPLE_RECT_WITH_TITLE",
		svgCode: TEST_SVGS.SIMPLE_RECT_WITH_TITLE,
		additionalTests: [testWithTitle],
	});

	testSVG({
		name: "SIMPLE_RECT_EMPTY_TITLE",
		svgCode: TEST_SVGS.SIMPLE_RECT_EMPTY_TITLE,
		additionalTests: [testWithEmptyTitle],
	});

	const testClassesWithGroupAndRects = ({ beforeSvgEl }: ICompTestCtx) => {
		expect(beforeSvgEl.children).toHaveLength(1);

		const group = beforeSvgEl.children[0] as ElementNode;
		expect(group).toBeTypeOf("object");
		expect(group.type).toBe("element");
		expect(group.tagName).toBe("g");
		expect(group.properties.id).toBe(TEST_SVG_GROUP_ID);
		expect(group.children).toHaveLength(2);

		const rect1 = group.children[0] as ElementNode;
		expect(rect1).toBeTypeOf("object");
		expect(rect1.type).toBe("element");
		expect(rect1.tagName).toBe("rect");
		expect(rect1.properties.id).toBe(TEST_SVG_RECT_1_ID);

		const rect2 = group.children[1] as ElementNode;
		expect(rect2).toBeTypeOf("object");
		expect(rect2.type).toBe("element");
		expect(rect2.tagName).toBe("rect");
		expect(rect2.properties.id).toBe(TEST_SVG_RECT_2_ID);
	};

	const testClassesRect = ({ beforeSvgEl }: ICompTestCtx) => {
		expect(beforeSvgEl.children).toHaveLength(1);

		const rect1 = beforeSvgEl.children[0] as ElementNode;
		expect(rect1).toBeTypeOf("object");
		expect(rect1.type).toBe("element");
		expect(rect1.tagName).toBe("rect");
		expect(rect1.properties.id).toBe(TEST_SVG_RECT_1_ID);
	};

	testSVG({
		name: "GROUP_2_RECTS_WITH_IDS",
		svgCode: TEST_SVGS.GROUP_2_RECTS_WITH_IDS,
		additionalTests: [testClassesWithGroupAndRects],
	});

	testSVG({
		name: "RECTS_WITH_ID",
		svgCode: TEST_SVGS.RECTS_WITH_ID,
		additionalTests: [testClassesRect],
	});
});
