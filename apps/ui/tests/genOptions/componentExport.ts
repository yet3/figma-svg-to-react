import { FrameworkEnum } from "@shared/types";
import { TEST_SVGS } from "tests/lib/consts";
import { prepareCompTestCtx } from "tests/lib/prepareCompTestCtx";
import { describe, expect, test } from "vitest";

describe("component export", () => {
	for (const framework of Object.values(FrameworkEnum)) {
		describe(framework, () => {
			test("should have named export", async () => {
				const ctx = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					framework,
					genOptions: { namedExport: true },
				});

				expect(ctx.component.code).toContain(
					`export const ${ctx.component.componentName} =`,
				);
				expect(ctx.component.code).not.toContain(
					`export default ${ctx.component.componentName};`,
				);
			});

			test("should have default export", async () => {
				const ctx = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					framework,
					genOptions: { namedExport: true },
				});

				expect(ctx.component.code).not.toContain(
					`export const ${ctx.component.componentName} =`,
				);
				expect(ctx.component.code).toContain(
					`export default ${ctx.component.componentName};`,
				);
			});
		});
	}
});
