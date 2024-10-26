import { REACT_FRAMEWORKS } from "@shared/lib";
import { FrameworkEnum, type IComponent } from "@shared/types";
import { parseClassAttr } from "src/lib/svgo/parseClassAttr";
import type { ElementNode } from "svg-parser";
import { getTestClassAttr } from "tests/lib/getTestClassAttr";
import { describe, expect, test } from "vitest";
import {
	TEST_SVGS,
	TEST_SVG_GROUP_ID,
	TEST_SVG_GROUP_ID_PARSED,
	TEST_SVG_RECT_1_ID,
	TEST_SVG_RECT_1_ID_PARSED,
	TEST_SVG_RECT_2_ID,
	TEST_SVG_RECT_2_ID_PARSED,
} from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("smart classes", () => {
	test("parse class attribute", () => {
		expect(parseClassAttr("Group 1")).toBe("Group1");
		expect(parseClassAttr("Group_1")).toBe("Group_1");
		expect(parseClassAttr("21Group_1")).toBe("Group_1");
		expect(parseClassAttr("21Group:1")).toBe("Group\\:1");
		expect(parseClassAttr("Group 1 (special)")).toBe("Group1\\(special\\)");
		expect(parseClassAttr("Group_1__Rectangle_1")).toBe("Group_1__Rectangle_1");

		expect(parseClassAttr(TEST_SVG_GROUP_ID)).toBe(TEST_SVG_GROUP_ID_PARSED);
		expect(parseClassAttr(TEST_SVG_RECT_1_ID)).toBe(TEST_SVG_RECT_1_ID_PARSED);
		expect(parseClassAttr(TEST_SVG_RECT_2_ID)).toBe(TEST_SVG_RECT_2_ID_PARSED);
	});

	const checkCodeForClasses = (
		component: IComponent,
		framework: FrameworkEnum,
	) => {
		const attrName = REACT_FRAMEWORKS.includes(framework)
			? "className"
			: "class";

		return component.code.match(new RegExp(`${attrName}=`, "gm"));
	};

	for (const framework of Object.values(FrameworkEnum)) {
		describe(framework, () => {
			describe("Group with 2 rects", () => {
				test("should have BEM classes on <svg> and 2 <rects>", async () => {
					const { svgEl, component } = await prepareCompTestCtx({
						svgCode: TEST_SVGS.GROUP_2_RECTS_WITH_IDS,
						framework,
						genOptions: {
							nodesNamesToClasses: true,
              bemClasses: true,
						},
					});

					expect(checkCodeForClasses(component, framework)).toHaveLength(3);
					expect(getTestClassAttr(svgEl, framework)).toBe(
						TEST_SVG_GROUP_ID_PARSED,
					);

					expect(
						getTestClassAttr(svgEl.children[0] as ElementNode, framework),
					).toBe(`${TEST_SVG_GROUP_ID_PARSED}__${TEST_SVG_RECT_1_ID_PARSED}`);
					expect(
						getTestClassAttr(svgEl.children[1] as ElementNode, framework),
					).toBe(`${TEST_SVG_GROUP_ID_PARSED}__${TEST_SVG_RECT_2_ID_PARSED}`);
				});

				test("should have exact classes on <svg> and 2 <rects>", async () => {
					const { svgEl, component } = await prepareCompTestCtx({
						svgCode: TEST_SVGS.GROUP_2_RECTS_WITH_IDS,
						framework,
						genOptions: {
							nodesNamesToClasses: true,
						},
					});

					expect(checkCodeForClasses(component, framework)).toHaveLength(3);
					expect(getTestClassAttr(svgEl, framework)).toBe(
						TEST_SVG_GROUP_ID_PARSED,
					);

					expect(
						getTestClassAttr(svgEl.children[0] as ElementNode, framework),
					).toBe(TEST_SVG_RECT_1_ID_PARSED);
					expect(
						getTestClassAttr(svgEl.children[1] as ElementNode, framework),
					).toBe(TEST_SVG_RECT_2_ID_PARSED);
				});


				test("should have BEM class only on <svg>", async () => {
					const { svgEl, component } = await prepareCompTestCtx({
						svgCode: TEST_SVGS.GROUP_2_RECTS_WITH_IDS,
						framework,
						genOptions: {
              nodesNamesToClasses: true,
							bemClasses: true,
							classOnlyOnSvg: true,
						},
					});

					expect(checkCodeForClasses(component, framework)).toHaveLength(1);
					expect(getTestClassAttr(svgEl, framework)).toBe(
						TEST_SVG_GROUP_ID_PARSED,
					);
				});

				test("should have exact class only on <svg>", async () => {
					const { svgEl, component } = await prepareCompTestCtx({
						svgCode: TEST_SVGS.GROUP_2_RECTS_WITH_IDS,
						framework,
						genOptions: {
							nodesNamesToClasses: true,
							classOnlyOnSvg: true,
						},
					});

					expect(checkCodeForClasses(component, framework)).toHaveLength(1);
					expect(getTestClassAttr(svgEl, framework)).toBe(
						TEST_SVG_GROUP_ID_PARSED,
					);
				});
			});

			describe("1 rect", () => {
				test("should have class on <svg>", async () => {
					const { svgEl, component } = await prepareCompTestCtx({
						svgCode: TEST_SVGS.RECTS_WITH_ID,
						framework,
						genOptions: {
              nodesNamesToClasses: true
						},
					});

					expect(checkCodeForClasses(component, framework)).toHaveLength(1);
					expect(getTestClassAttr(svgEl, framework)).toBe(
						TEST_SVG_RECT_1_ID_PARSED,
					);
				});
			});
		});
	}
});
