import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove viewBox", () => {
	test("should remove viewBox", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeViewbox: true,
			},
		});

		expect(svgEl.properties).not.toHaveProperty("viewBox");
	});

	describe("with svgValues.viewBox", () => {
		test("should have viewBox", async () => {
			const svgVal = "0 0 99 22";
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				svgValues: { viewBox: svgVal },
				genOptions: {
					removeViewbox: true,
				},
			});

			expect(svgEl.properties).toHaveProperty("viewBox");
			expect(svgEl.properties.viewBox).toBe(svgVal);
		});
	});
});
