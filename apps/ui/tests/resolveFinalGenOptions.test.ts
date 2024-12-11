import { resolveFinalGenOptions } from "@lib";
import { GEN_OPTIONS_METADATA, makeDefaultGenOptions } from "@shared/lib";
import { FrameworkEnum, type IGenOptionsMetaKeys } from "@shared/types";
import { describe, expect, test } from "vitest";

describe("util: resolve final generation options", () => {
	for (const framework of Object.values(FrameworkEnum)) {
		test(`[${framework}]: all options should be false`, () => {
			const genOptions = {
				...makeDefaultGenOptions(),
			};
			for (const key in genOptions) {
				genOptions[key] = false;
			}

			for (const key in resolveFinalGenOptions({ genOptions, framework })) {
				expect(genOptions[key]).toBe(false);
			}
		});

		test(`[${framework}]: icon mode should be false`, () => {
			let genOptions = {
				...makeDefaultGenOptions(),
			};
			for (const key in genOptions) {
				genOptions[key] = false;
			}

			genOptions.iconMode = true;
			genOptions.removeWidth = true;
			genOptions.removeHeight = true;

			genOptions = resolveFinalGenOptions({ genOptions, framework });

			expect(genOptions.iconMode).toBe(false);
		});

		test(`[${framework}]: icon mode should be true`, () => {
			let genOptions = {
				...makeDefaultGenOptions(),
			};
			for (const key in genOptions) {
				genOptions[key] = false;
			}

			genOptions.iconMode = true;
			genOptions.removeWidth = false;
			genOptions.removeHeight = true;

			genOptions = resolveFinalGenOptions({ genOptions, framework });

			expect(genOptions.iconMode).toBe(true);

			for (const key in genOptions) {
				genOptions[key] = false;
			}

			genOptions.iconMode = true;
			genOptions.removeWidth = true;
			genOptions.removeHeight = false;

			genOptions = resolveFinalGenOptions({ genOptions, framework });

			expect(genOptions.iconMode).toBe(true);
		});

		if (framework !== FrameworkEnum.SVG) {
			const isForwardRefFalse = ![
				FrameworkEnum.REACT18,
				FrameworkEnum.REACT_NATIVE,
			].includes(framework);

			test(`[${framework}]: forwardRef should be ${!isForwardRefFalse}`, () => {
				let genOptions = {
					...makeDefaultGenOptions(),
				};
				for (const key in genOptions) {
					genOptions[key] = false;
				}

				genOptions.props = true;
				genOptions.spreadProps = true;
				genOptions.forwardRef = true;

				genOptions = resolveFinalGenOptions({
					genOptions,
					framework,
				});

				expect(genOptions.props).toBe(true);
				expect(genOptions.spreadProps).toBe(true);
				expect(genOptions.forwardRef).toBe(!isForwardRefFalse);
			});

			test(`[${framework}]: Props interface should be false`, () => {
				let genOptions = {
					...makeDefaultGenOptions(),
				};
				for (const key in genOptions) {
					genOptions[key] = false;
				}

				genOptions.props = false;
				genOptions.propsInterface = true;

				genOptions = resolveFinalGenOptions({
					genOptions,
					framework,
				});

				expect(genOptions.props).toBe(false);
				expect(genOptions.propsInterface).toBe(false);
			});

			test(`[${framework}]: Spread props should be false`, () => {
				let genOptions = {
					...makeDefaultGenOptions(),
				};
				for (const key in genOptions) {
					genOptions[key] = false;
				}

				genOptions.props = false;
				genOptions.spreadProps = true;

				genOptions = resolveFinalGenOptions({
					genOptions,
					framework,
				});

				expect(genOptions.props).toBe(false);
				expect(genOptions.spreadProps).toBe(false);
			});
		}
	}

	test(`[${FrameworkEnum.SVG}]: JSX options should be false`, () => {
		let genOptions = {
			...makeDefaultGenOptions(),
		};
		for (const key in genOptions) {
			genOptions[key] = true;
		}

		genOptions = resolveFinalGenOptions({
			genOptions,
			framework: FrameworkEnum.SVG,
		});

		for (const key in GEN_OPTIONS_METADATA) {
			const meta = GEN_OPTIONS_METADATA[key as IGenOptionsMetaKeys];

			if (key !== "iconMode") {
				expect(genOptions[key]).toBe(
					meta.frameworks.includes(FrameworkEnum.SVG),
				);
			} else expect(genOptions.iconMode).toBe(false);
		}
	});

	test(`[${FrameworkEnum.SOLID}]: React options should be false`, () => {
		let genOptions = {
			...makeDefaultGenOptions(),
		};
		for (const key in genOptions) {
			genOptions[key] = true;
		}

		genOptions = resolveFinalGenOptions({
			genOptions,
			framework: FrameworkEnum.SOLID,
		});

		expect(genOptions.importAllAsReact).toBe(false);
	});
});
