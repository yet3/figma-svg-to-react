import { hasTestSvgAttributeAnywhere } from "tests/lib/hasTestSvgAttributeAnywhere";
import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove all stroke attributes", () => {
	test("should remove all stroke", async () => {
		const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeAllStrokeAttributes: true,
			},
		});

		expect(hasTestSvgAttributeAnywhere(beforeSvgEl, "stroke")).toBe(true);
		expect(hasTestSvgAttributeAnywhere(svgEl, "stroke")).toBe(false);
	});
});
