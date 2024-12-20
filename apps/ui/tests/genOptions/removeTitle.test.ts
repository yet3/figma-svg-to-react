import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import {
	getTestTitleElement,
	getTestTitleValue,
} from "../lib/getTestTitleValue";
import { prepareCompTestCtx } from "../lib/prepareCompTestCtx";

describe("remove title", () => {
	describe("on svg with no title", () => {
		test("should do nothing", async () => {
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT,
				genOptions: {
					removeTitle: true,
				},
			});

			expect(getTestTitleElement(svgEl)).toBeNull();
		});

		describe("with svgValues.title", () => {
			test("should have title", async () => {
				const title = "Inserted title";
				const { svgEl } = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					svgValues: { title },
					genOptions: {
						removeTitle: true,
					},
				});

				expect(getTestTitleValue(svgEl)).toBe(title);
			});
		});
	});

	describe("on svg with title", () => {
		test("title should be removed", async () => {
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT_WITH_TITLE,
				genOptions: {
					removeTitle: true,
				},
			});

			expect(getTestTitleElement(svgEl)).toBeNull();
		});

		describe("with svgValues.title", () => {
			test("should have title", async () => {
				const title = "Inserted title";
				const { svgEl } = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT_WITH_TITLE,
					svgValues: { title },
					genOptions: {
						removeTitle: true,
					},
				});

				expect(getTestTitleValue(svgEl)).toBe(title);
			});
		});
	});

	describe("on svg with empty title", () => {
		test("title should be removed", async () => {
			const { svgEl } = await prepareCompTestCtx({
				svgCode: TEST_SVGS.SIMPLE_RECT_EMPTY_TITLE,
				genOptions: {
					removeTitle: true,
				},
			});

			expect(getTestTitleElement(svgEl)).toBeNull();
		});

		describe("with svgValues.title", () => {
			test("should have title", async () => {
				const title = "Inserted title";
				const { svgEl } = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT_EMPTY_TITLE,
					svgValues: { title },
					genOptions: {
						removeTitle: true,
					},
				});

				expect(getTestTitleValue(svgEl)).toBe(title);
			});
		});
	});
});
