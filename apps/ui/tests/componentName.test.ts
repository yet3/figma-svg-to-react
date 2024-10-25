import { isComponentNameValid, strToComponentName } from "@lib";
import { describe, expect, test } from "vitest";

describe("util: string to component name", () => {
	const testValidName = (name: string) => {
		test(`returns "${name}" unchanged`, () => {
			expect(isComponentNameValid(name)).toBe(true);
			expect(strToComponentName(name)).toBe(name);
		});
	};

	const testInvalidName = (name: string, expected: string) => {
		test(`changes from "${name}" to "${expected}"`, () => {
			expect(isComponentNameValid(name)).toBe(false);
			const parsedName = strToComponentName(name);
			expect(parsedName).toBe(expected);
			expect(isComponentNameValid(parsedName)).toBe(true);
		});
	};

	testValidName("ComponentIcon");
	testValidName("Componenticon");
	testValidName("Componenticon_svg");
	testValidName("Icon");

	testValidName("ComponentIcon2");

	testInvalidName("icon/video-1", "IconVideo1");
	testInvalidName("icon/video-2", "IconVideo2");
	testInvalidName("icon video 2", "IconVideo2");

	testInvalidName("icon", "Icon");
	testInvalidName("component Icon", "ComponentIcon");
	testInvalidName("component icon", "ComponentIcon");
	testInvalidName("component :icon", "ComponentIcon");
	testInvalidName("componentIcon", "ComponentIcon");
	testInvalidName("componenticon", "Componenticon");
	testInvalidName("component_icon", "Component_icon");
	testInvalidName("component:icon", "ComponentIcon");
	testInvalidName("2component:_icon1", "Component_icon1");
	testInvalidName("12complex_icon:svg-test:", "Complex_iconSvgTest");
});
