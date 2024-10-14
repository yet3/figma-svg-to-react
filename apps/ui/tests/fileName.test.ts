import { strToFileName } from "@lib";
import { describe, expect, test } from "vitest";

describe("util: string to file name", () => {
	const testValidName = (name: string) => {
		test(`returns "${name}" unchanged`, () => {
			expect(strToFileName(name)).toBe(name);
		});
	};

	const testInvalidName = (name: string, expected: string) => {
		test(`changes from "${name}" to "${expected}"`, () => {
			expect(strToFileName(name)).toBe(expected);
		});
	};

	testValidName("Component_icon");
	testValidName("Component-icon");
	testValidName("(ComponentIcon)");
	testValidName("component.icon");
	testValidName("(ComponentIcon)");
	testValidName("1Component:icon");

	testInvalidName("Component icon", "ComponentIcon");
	testInvalidName("Component _icon", "Component_icon");
	testInvalidName(" ComponentIcon ", "ComponentIcon");
});
