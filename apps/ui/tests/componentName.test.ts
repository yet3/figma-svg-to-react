import { strToComponentName } from "@lib";
import { describe, expect, test } from "vitest";

describe("util: string to component name", () => {
	const testValidName = (name: string) => {
		test(`returns "${name}" unchanged`, () => {
			expect(strToComponentName(name)).toBe(name);
		});
	};

	const testInvalidName = (name: string, expected: string) => {
		test(`changes from "${name}" to "${expected}"`, () => {
			expect(strToComponentName(name)).toBe(expected);
		});
	};

	testValidName("ComponentIcon");
	testValidName("Componenticon");
	testValidName("Componenticon_svg");
	testValidName("Icon");

	testInvalidName("icon", "Icon");
	testInvalidName("component Icon", "ComponentIcon");
	testInvalidName("component icon", "ComponentIcon");
	testInvalidName("component :icon", "ComponentIcon");
	testInvalidName("componentIcon", "ComponentIcon");
	testInvalidName("componenticon", "Componenticon");
	testInvalidName("component_icon", "Component_icon");
	testInvalidName("component:icon", "ComponentIcon");
	testInvalidName("2component:_icon1", "ComponentIcon1");
	testInvalidName("12complex_icon:svg-test:", "Complex_iconSvgTest");
});
