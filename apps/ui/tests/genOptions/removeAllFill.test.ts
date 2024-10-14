import { hasTestSvgAttributeAnywhere } from "tests/lib/hasTestSvgAttributeAnywhere";
import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove all fill attributes", () => {
	test("should remove all fill", async () => {
		const { svgEl, beforeSvgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				removeAllFillAttributes: true,
			},
		});

		expect(hasTestSvgAttributeAnywhere(beforeSvgEl, "fill")).toBe(true);
		expect(hasTestSvgAttributeAnywhere(svgEl, "fill")).toBe(false);
	});
});
