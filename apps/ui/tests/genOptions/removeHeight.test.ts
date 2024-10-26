import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove height", () => {
	test("should remove height", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeHeight: true,
			},
		});

		expect(svgEl.properties).not.toHaveProperty("height");
	});

	describe("with svgValues.height", () => {
		test("should have height", async () => {
			const svgVal = 12;
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				svgValues: { height: svgVal.toString() },
				genOptions: {
					removeHeight: true,
				},
			});

			expect(svgEl.properties).toHaveProperty("height");
			expect(svgEl.properties.height).toBe(svgVal);
		});
	});
});
