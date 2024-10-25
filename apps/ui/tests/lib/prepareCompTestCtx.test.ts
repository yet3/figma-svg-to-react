import { FrameworkEnum } from "@shared/types";
import { describe, expect, test } from "vitest";
import {
	TEST_SVGS,
	TEST_SVG_HEIGHT,
	TEST_SVG_TITLE,
	TEST_SVG_VIEWBOX,
	TEST_SVG_WIDTH,
} from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";
import { getTestTitleElement, getTestTitleValue } from "./getTestTitleValue";

describe("test util: prepare component test context", () => {
	const testSVG = (
		name: string,
		svgCode: string,
		titleStatus: "without" | "with" | "with_empty",
	) => {
		for (const framework of Object.values(FrameworkEnum)) {
			test(`[${framework}] ${name} should have properties`, async () => {
				const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
					svgCode,
					framework,
					genOptions: {},
				});

				expect(beforeSvgEl.properties).toHaveProperty("width");
				expect(beforeSvgEl.properties).toHaveProperty("height");
				expect(beforeSvgEl.properties).toHaveProperty("viewBox");
				expect(beforeSvgEl.properties.width).toBe(TEST_SVG_WIDTH);
				expect(beforeSvgEl.properties.height).toBe(TEST_SVG_HEIGHT);
				expect(beforeSvgEl.properties.viewBox).toBe(TEST_SVG_VIEWBOX);

				expect(svgEl.properties).toHaveProperty("width");
				expect(svgEl.properties).toHaveProperty("height");
				expect(svgEl.properties).toHaveProperty("viewBox");
				expect(svgEl.properties.width).toBe(TEST_SVG_WIDTH);
				expect(svgEl.properties.height).toBe(TEST_SVG_HEIGHT);
				expect(svgEl.properties.viewBox).toBe(TEST_SVG_VIEWBOX);

				if (framework === FrameworkEnum.REACT_NATIVE) {
					expect(getTestTitleElement(svgEl)).toBeNull();
					expect(getTestTitleValue(svgEl)).toBeNull();
				} else {
					if (titleStatus === "without") {
						expect(getTestTitleElement(beforeSvgEl)).toBeNull();
						expect(getTestTitleElement(svgEl)).toBeNull();
					} else if (titleStatus === "with") {
						expect(getTestTitleElement(beforeSvgEl)).toBeDefined();
						expect(getTestTitleValue(beforeSvgEl)).toBe(TEST_SVG_TITLE);
						expect(getTestTitleElement(svgEl)).toBeDefined();
						expect(getTestTitleValue(svgEl)).toBe(TEST_SVG_TITLE);
					} else if (titleStatus === "with_empty") {
						expect(getTestTitleElement(beforeSvgEl)).toBeDefined();
						expect(getTestTitleValue(beforeSvgEl)).toBeNull();
						expect(getTestTitleElement(svgEl)).toBeDefined();
						expect(getTestTitleValue(svgEl)).toBeNull();
					}
				}
			});
		}
	};

	testSVG("SIMPLE_RECT", TEST_SVGS.SIMPLE_RECT, "without");
	testSVG("SIMPLE_RECT_OPTIMIZED", TEST_SVGS.SIMPLE_RECT_OPTIMIZED, "without");
	testSVG("SIMPLE_RECT_WITH_TITLE", TEST_SVGS.SIMPLE_RECT_WITH_TITLE, "with");
	testSVG(
		"SIMPLE_RECT_EMPTY_TITLE",
		TEST_SVGS.SIMPLE_RECT_EMPTY_TITLE,
		"with_empty",
	);
});
