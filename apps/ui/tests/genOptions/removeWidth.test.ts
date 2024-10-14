import { describe, expect, test } from "vitest";
import { TEST_SVGS, TEST_SVG_WIDTH } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove width", () => {
	test("should remove width", async () => {
		const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeWidth: true,
			},
		});

		expect(beforeSvgEl.properties).toHaveProperty("width");
		expect(beforeSvgEl.properties.width).toBe(TEST_SVG_WIDTH);
		expect(svgEl.properties).not.toHaveProperty("width");
	});

	describe("with svgValues.width", () => {
		test("should have width", async () => {
			const svgVal = 22;
			const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				svgValues: { width: svgVal.toString() },
				genOptions: {
					removeWidth: true,
				},
			});

			expect(beforeSvgEl.properties).toHaveProperty("width");
			expect(beforeSvgEl.properties.width).toBe(TEST_SVG_WIDTH);
			expect(svgEl.properties).toHaveProperty("width");
			expect(svgEl.properties.width).toBe(svgVal);
		});
	});
});
