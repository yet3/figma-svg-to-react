import {
	SVG_PLACEHOLDERS,
	extractSvgCodeFromCompCode,
	generateOptimizedSvg,
} from "@lib";
import { makeDefaultGenOptions } from "@shared/lib";
import { FrameworkEnum, type ISvgValues } from "@shared/types";
import { type ElementNode, parse as parseSvg } from "svg-parser";
import { describe, expect, test } from "vitest";
import {
	OG_SVG_ID,
	OG_SVG_NODE_NAME,
	TEST_SVGS,
	TEST_SVG_TITLE,
} from "./lib/consts";
import { getTestTitleValue } from "./lib/getTestTitleValue";

describe("generation of optimized svg using svgo", () => {
	for (const framework of Object.values(FrameworkEnum)) {
		describe(framework, () => {
			test("optimizes svg", () => {
				const { svgCode } = generateOptimizedSvg({
					originalSvg: {
						id: OG_SVG_ID,
						nodeName: OG_SVG_NODE_NAME,
						data: TEST_SVGS.SIMPLE_RECT,
					},
					framework: FrameworkEnum.SVG,
					genOptions: makeDefaultGenOptions(),
					svgValues: {},
				});

				expect(svgCode.replaceAll("/r/n", "")).toBe(
					TEST_SVGS.SIMPLE_RECT_OPTIMIZED,
				);
			});

			describe("svgDefaultValues", () => {
				test("returns correct default values without title ", () => {
					const { svgDefaultValues } = generateOptimizedSvg({
						originalSvg: {
							id: OG_SVG_ID,
							nodeName: OG_SVG_NODE_NAME,
							data: TEST_SVGS.SIMPLE_RECT,
						},
						framework,
						genOptions: makeDefaultGenOptions(),
						svgValues: {
							title: "title",
							width: "99",
							viewBox: "0 0 124 124",
						},
					});

					expect(svgDefaultValues.title).toBe("");
					expect(svgDefaultValues.width).toBe("144");
					expect(svgDefaultValues.height).toBe("144");
					expect(svgDefaultValues.viewBox).toBe("0 0 144 144");
				});

				test("returns correct default values with title", () => {
					const { svgDefaultValues } = generateOptimizedSvg({
						originalSvg: {
							id: OG_SVG_ID,
							nodeName: OG_SVG_NODE_NAME,
							data: TEST_SVGS.SIMPLE_RECT_WITH_TITLE,
						},
						framework,
						genOptions: makeDefaultGenOptions(),
						svgValues: {
							title: "title",
							width: "99",
							viewBox: "0 0 124 124",
						},
					});

					expect(svgDefaultValues.title).toBe(TEST_SVG_TITLE);
					expect(svgDefaultValues.width).toBe("144");
					expect(svgDefaultValues.height).toBe("144");
					expect(svgDefaultValues.viewBox).toBe("0 0 144 144");
				});
			});

			describe("insert values", () => {
				const testInsertedValues = (
					code: string,
					values: ISvgValues,
					_defaultValues: ISvgValues = {},
				) => {
					const defaultValues: ISvgValues = {
						width: "144",
						height: "144",
						viewBox: "0 0 144 144",
						title: null,
						..._defaultValues,
					};

					const { svgCode } = generateOptimizedSvg({
						originalSvg: {
							id: OG_SVG_ID,
							nodeName: OG_SVG_NODE_NAME,
							data: code,
						},
						framework,
						genOptions: makeDefaultGenOptions(),
						svgValues: values,
					});

					const parsedSvg = parseSvg(extractSvgCodeFromCompCode(svgCode));
					expect(parsedSvg.children.length).toBe(1);
					const svgNode = parsedSvg.children[0] as ElementNode;

					if (Object.hasOwn(values, "width")) {
						expect(svgNode.properties.width.toString()).toBe(values.width);
					} else {
						expect(svgNode.properties.width.toString()).toBe(
							defaultValues.width,
						);
					}

					if (Object.hasOwn(values, "height")) {
						expect(svgNode.properties.height.toString()).toBe(values.height);
					} else {
						expect(svgNode.properties.height.toString()).toBe(
							defaultValues.height,
						);
					}

					if (Object.hasOwn(values, "viewBox")) {
						expect(svgNode.properties.viewBox).toBe(values.viewBox);
					} else {
						expect(svgNode.properties.viewBox.toString()).toBe(
							defaultValues.viewBox,
						);
					}

					// react native doesn't support <title>
					if (framework !== FrameworkEnum.REACT_NATIVE) {
						const titleFromSvg = getTestTitleValue(svgNode);
						if (Object.hasOwn(values, "title")) {
							expect(titleFromSvg).toBe(values.title);
						} else {
							expect(titleFromSvg).toBe(defaultValues.title);
						}
					}
				};

				test("all values", () => {
					testInsertedValues(TEST_SVGS.SIMPLE_RECT, {
						title: "title",
						width: "99",
						height: "29",
						viewBox: "0 0 124 124",
					});
				});

				test("some values", () => {
					testInsertedValues(TEST_SVGS.SIMPLE_RECT, {
						title: "title",
						width: "99",
					});
				});

				test("overwritten title", () => {
					testInsertedValues(TEST_SVGS.SIMPLE_RECT_WITH_TITLE, {
						title: "title",
					});
				});

				test("no values", () => {
					testInsertedValues(TEST_SVGS.SIMPLE_RECT, {});
				});

				test("no values (with default title)", () => {
					testInsertedValues(
						TEST_SVGS.SIMPLE_RECT_WITH_TITLE,
						{},
						{ title: TEST_SVG_TITLE },
					);
				});

				test("no values (with empty title)", () => {
					testInsertedValues(TEST_SVGS.SIMPLE_RECT_EMPTY_TITLE, {});
				});
			});

			describe("insert placeholders", () => {
				test("should have placeholders ", () => {
					const { svgCode } = generateOptimizedSvg({
						originalSvg: {
							id: OG_SVG_ID,
							nodeName: OG_SVG_NODE_NAME,
							data: TEST_SVGS.SIMPLE_RECT,
						},
						framework,
						genOptions: makeDefaultGenOptions(),
						svgValues: {},
					});

					const parsedSvg = parseSvg(extractSvgCodeFromCompCode(svgCode));
					expect(parsedSvg.children.length).toBe(1);
					const svgNode = parsedSvg.children[0] as ElementNode;

					expect(svgNode.properties).toHaveProperty(
						SVG_PLACEHOLDERS.ATTRS.SPREAD_PROPS,
					);
					expect(svgNode.properties).toHaveProperty(SVG_PLACEHOLDERS.ATTRS.REF);
				});
			});

			describe("svgTransformationInfo", () => {
				if (framework !== FrameworkEnum.REACT_NATIVE) {
					test("should be empty", () => {
						const { svgTransformationInfo } = generateOptimizedSvg({
							originalSvg: {
								id: OG_SVG_ID,
								nodeName: OG_SVG_NODE_NAME,
								data: TEST_SVGS.SIMPLE_RECT,
							},
							framework,
							genOptions: makeDefaultGenOptions(),
							svgValues: {},
						});

						expect(svgTransformationInfo.removedAttributes).toHaveLength(0);
						expect(svgTransformationInfo.removedElements).toHaveLength(0);
						expect(svgTransformationInfo.usedReactNativeElements).toHaveLength(
							0,
						);
					});
				} else {
					test("should be empty", () => {
						const { svgTransformationInfo } = generateOptimizedSvg({
							originalSvg: {
								id: OG_SVG_ID,
								nodeName: OG_SVG_NODE_NAME,
								data: TEST_SVGS.SIMPLE_RECT,
							},
							framework: FrameworkEnum.REACT_NATIVE,
							genOptions: makeDefaultGenOptions(),
							svgValues: {},
						});

						expect(svgTransformationInfo.removedAttributes).toHaveLength(0);
						expect(svgTransformationInfo.removedElements).toHaveLength(0);
					});

					test("should match ['Svg', 'Path']", () => {
						const { svgTransformationInfo } = generateOptimizedSvg({
							originalSvg: {
								id: OG_SVG_ID,
								nodeName: OG_SVG_NODE_NAME,
								data: TEST_SVGS.SIMPLE_RECT,
							},
							framework: FrameworkEnum.REACT_NATIVE,
							genOptions: makeDefaultGenOptions(),
							svgValues: {},
						});

						expect(
							[...svgTransformationInfo.usedReactNativeElements].sort(),
						).toStrictEqual(["Svg", "Path"].sort());
					});
				}
			});
		});
	}
});
