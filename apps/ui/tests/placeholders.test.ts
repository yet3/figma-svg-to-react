import { SVG_PLACEHOLDER_PREFIX } from "@lib";
import { FrameworkEnum } from "@shared/types";
import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "./lib/consts";
import { prepareCompTestCtx } from "./lib/prepareCompTestCtx";

describe("placeholder removal", () => {
	for (const framework of Object.values(FrameworkEnum)) {
		describe(framework, () => {
			test("no plachodler should be present", async () => {
				const { component } = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					genOptions: {},
				});

				expect(component.code).not.toContain(SVG_PLACEHOLDER_PREFIX);
			});
		});
	}
});
