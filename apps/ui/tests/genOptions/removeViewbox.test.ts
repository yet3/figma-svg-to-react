import { describe, expect, test } from "vitest";
import { TEST_SVGS, TEST_SVG_VIEWBOX } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove viewBox", () => {
	test("should remove viewBox", async () => {
		const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeViewbox: true,
			},
		});

		expect(beforeSvgEl.properties).toHaveProperty("viewBox");
		expect(beforeSvgEl.properties.viewBox).toBe(TEST_SVG_VIEWBOX);
		expect(svgEl.properties).not.toHaveProperty("viewBox");
	});

	describe("with svgValues.viewBox", () => {
		test("should have viewBox", async () => {
			const svgVal = "0 0 99 22";
			const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				svgValues: { viewBox: svgVal },
				genOptions: {
					removeViewbox: true,
				},
			});

			expect(beforeSvgEl.properties).toHaveProperty("viewBox");
			expect(beforeSvgEl.properties.viewBox).toBe(TEST_SVG_VIEWBOX);
			expect(svgEl.properties).toHaveProperty("viewBox");
			expect(svgEl.properties.viewBox).toBe(svgVal);
		});
	});
});
