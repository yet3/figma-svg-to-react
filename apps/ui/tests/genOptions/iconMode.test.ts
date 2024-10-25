import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("icon mode", () => {
	test("width and height = 1em", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				iconMode: true,
			},
		});

		expect(svgEl.properties).toHaveProperty("width");
		expect(svgEl.properties).toHaveProperty("height");
		expect(svgEl.properties.width).toBe("1em");
		expect(svgEl.properties.height).toBe("1em");
	});

	test("width = 1em, no height", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				iconMode: true,
				removeHeight: true,
			},
		});

		expect(svgEl.properties).toHaveProperty("width");
		expect(svgEl.properties).not.toHaveProperty("height");
		expect(svgEl.properties.width).toBe("1em");
	});

	test("height = 1em, no width", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				iconMode: true,
				removeWidth: true,
			},
		});

		expect(svgEl.properties).toHaveProperty("height");
		expect(svgEl.properties).not.toHaveProperty("width");
		expect(svgEl.properties.height).toBe("1em");
	});

	test("no width and no height", async () => {
		const { svgEl } = await prepareCompTestCtx({
			svgCode: TEST_SVGS.SIMPLE_RECT,
			genOptions: {
				iconMode: true,
				removeWidth: true,
				removeHeight: true,
			},
		});

		expect(svgEl.properties).not.toHaveProperty("height");
		expect(svgEl.properties).not.toHaveProperty("width");
	});

	describe("with svgValues", () => {
		test("width and height should be overwritten", async () => {
			const width = "31";
			const height = "22";
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				genOptions: {
					iconMode: true,
				},
				svgValues: {
					width,
					height,
				},
			});

			expect(svgEl.properties).toHaveProperty("width");
			expect(svgEl.properties).toHaveProperty("height");
			expect(svgEl.properties.width.toString()).toBe(width);
			expect(svgEl.properties.height.toString()).toBe(height);
		});
	});
});
