import { extractSvgCodeFromCompCode } from "@lib";
import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "./lib/consts";

const JSX_COMP_SVG = `<svg
      width="144"
      height="144"
      viewBox="0 0 144 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="144" height="144" fill="#FF00F2" />
    </svg>`;

const JSX_COMP = `import type { SVGProps } from "react";

export const ComponentIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
${JSX_COMP_SVG}
  );
};`;

describe("util: extract svg code from component code", () => {
	test("returns unchanged svg code", () => {
		expect(extractSvgCodeFromCompCode(TEST_SVGS.SIMPLE_RECT)).toBe(
			TEST_SVGS.SIMPLE_RECT,
		);
	});

	test("extracts svg code from jsx component", () => {
		expect(extractSvgCodeFromCompCode(JSX_COMP)).toBe(JSX_COMP_SVG);
	});
});
