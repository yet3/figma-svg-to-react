import { REACT_FRAMEWORKS } from "@shared/lib";
import { FrameworkEnum } from "@shared/types";
import { TEST_SVGS } from "tests/lib/consts";
import { prepareCompTestCtx } from "tests/lib/prepareCompTestCtx";
import { describe, expect, test } from "vitest";

describe("import * as React", () => {
	const testReactImport = (framework: FrameworkEnum, value: boolean) => {
		describe(framework, () => {
			test(`should${value ? "" : " not"} have import * as React`, async () => {
				const { component } = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					framework,
					genOptions: {
						importAllAsReact: true,
					},
				});

				if (value) {
					expect(component.code).toContain('import * as React from "react";');
				} else {
					expect(component.code).not.toContain(
						'import * as React from "react";',
					);
				}
			});
		});
	};

	for (const framework of Object.values(FrameworkEnum)) {
		testReactImport(framework, REACT_FRAMEWORKS.includes(framework));
	}
});
