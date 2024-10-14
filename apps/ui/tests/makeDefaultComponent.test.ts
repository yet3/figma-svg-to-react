import { makeDefaultComponent } from "@lib";
import { ComponentStatus } from "@shared/types";
import { describe, expect, test } from "vitest";
import {
	OG_SVG_DATA,
	OG_SVG_ID,
	OG_SVG_NODE_NAME,
	makeTestOgSvg,
} from "./lib/consts";

describe("util: make default component", () => {
	test("doesn't modify originalSvg", () => {
		const originalSvg = makeTestOgSvg();

		makeDefaultComponent(originalSvg);

		expect(originalSvg.id).toBe(OG_SVG_ID);
		expect(originalSvg.nodeName).toBe(OG_SVG_NODE_NAME);
		expect(originalSvg.data).toBe(OG_SVG_DATA);
	});

	test("default component has correct svgId", () => {
		const comp = makeDefaultComponent(makeTestOgSvg());
		expect(comp.svgId).toBe(OG_SVG_ID);
	});

	test("default component status is GENERATING", () => {
		const comp = makeDefaultComponent(makeTestOgSvg());
		expect(comp.status).toBe(ComponentStatus.GENERATING);
	});

	test("default component has no code", () => {
		const comp = makeDefaultComponent(makeTestOgSvg());
		expect(comp.code).toBe(null);
	});

	test("default component has parsed componentName", () => {
		const comp = makeDefaultComponent(makeTestOgSvg());
		expect(comp.componentName).toBe("MyIcon");
	});

	test("default component has parsed fileName", () => {
		const comp = makeDefaultComponent(makeTestOgSvg());
		expect(comp.fileName).toBe("MyIcon");
	});
});
