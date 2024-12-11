import { JSX_FRAMEWORKS, REACT_FRAMEWORKS } from "@shared/lib";
import { FrameworkEnum, type IGenOptions } from "@shared/types";
import { describe, expect, test } from "vitest";
import { TEST_SVGS } from "../lib/consts";
import {
	type ICompTestCtx,
	prepareCompTestCtx,
} from "../lib/prepareCompTestCtx";
import { testJsxImports } from "../lib/testJsxImports";
import exp from "node:constants";

describe("jsx generation options ", () => {
	interface ITestOpts {
		name: string;
		tests: (ctx: ICompTestCtx) => void;
		framework: FrameworkEnum | FrameworkEnum[];
		genOptions?: Partial<IGenOptions>;
	}

	const makeTest = (opts: ITestOpts) => {
		const frameworks = Array.isArray(opts.framework)
			? opts.framework
			: [opts.framework];

		for (const framework of frameworks) {
			test(`[${framework}]: ${opts.name}`, async () => {
				const ctx = await prepareCompTestCtx({
					svgCode: TEST_SVGS.SIMPLE_RECT,
					framework,
					genOptions: opts.genOptions,
				});

				opts.tests(ctx);
			});
		}
	};

	makeTest({
		name: "should have Svg, Path in svgTransformationInfo.usedReactNativeElements",
		framework: FrameworkEnum.REACT_NATIVE,
		genOptions: {},
		tests: (ctx) => {
			expect(
				[...ctx.component.svgTransformationInfo.usedReactNativeElements].sort(),
			).toStrictEqual(["Svg", "Path"].sort());

			testJsxImports({
				code: ctx.component.code,
				default: "Svg",
				named: ["Path"],
				from: "react-native-svg",
			});
		},
	});

	makeTest({
		name: "should not have IProps interface",
		framework: JSX_FRAMEWORKS,
		genOptions: { propsInterface: true },
		tests: (ctx) => {
			expect(ctx.component.code).not.toContain("interface IProps");
		},
	});

	describe("with forwardRef", () => {
		makeTest({
			name: "should have forwardRef",
			framework: REACT_FRAMEWORKS,
			genOptions: { forwardRef: true },
			tests: (ctx) => {
				testJsxImports({
					code: ctx.component.code,
					named: ["forwardRef"],
					from: "react",
				});
				expect(ctx.component.code).toContain("forwardRef((_, ref)");
				expect(ctx.component.code).toContain("ref={ref}");
			},
		});

		makeTest({
			name: "should not have ref",
			framework: FrameworkEnum.SOLID,
			genOptions: { forwardRef: true },
			tests: (ctx) => {
				expect(ctx.component.code).not.toContain("ref={props.ref}");
			},
		});
	});

	describe("with props", () => {
		makeTest({
			name: "should not have IProps interface",
			framework: JSX_FRAMEWORKS,
			genOptions: { props: true, propsInterface: true },
			tests: (ctx) => {
				expect(ctx.component.code).not.toContain("interface IProps");
			},
		});

		makeTest({
			name: "should have props",
			framework: JSX_FRAMEWORKS,
			genOptions: { props: true },
			tests: (ctx) => {
				expect(ctx.component.code).toContain("(props");
			},
		});

		describe("with spreadProps", () => {
			makeTest({
				name: "should have {...props}",
				framework: JSX_FRAMEWORKS,
				genOptions: { props: true, spreadProps: true },
				tests: (ctx) => {
					expect(ctx.component.code).toContain("{...props}");
				},
			});
		});

		describe("with forward ref", () => {
			const genOpts: Partial<IGenOptions> = { props: true, forwardRef: true };
			makeTest({
				name: "should have forwardRef",
				framework: REACT_FRAMEWORKS,
				genOptions: genOpts,
				tests: (ctx) => {
					expect(ctx.component.code).toContain("forwardRef((props, ref)");
				},
			});

			makeTest({
				name: "should have ref",
				framework: FrameworkEnum.SOLID,
				genOptions: genOpts,
				tests: (ctx) => {
					expect(ctx.component.code).toContain("ref={props.ref}");
				},
			});
		});
	});

	describe("with typescript", () => {
		makeTest({
			name: "should not have IProps interface",
			framework: JSX_FRAMEWORKS,
			genOptions: { typescript: true, propsInterface: true },
			tests: (ctx) => {
				expect(ctx.component.code).not.toContain("interface IProps");
			},
		});

		describe("with forwardRef", () => {
			const genOpts: Partial<IGenOptions> = {
				forwardRef: true,
				typescript: true,
			};

			makeTest({
				name: "should have forwardRef",
				framework: REACT_FRAMEWORKS,
				genOptions: genOpts,
				tests: (ctx) => {
					expect(ctx.component.code).toContain(
						"forwardRef<SVGSVGElement>((_, ref)",
					);
				},
			});
		});
	});

	describe("with props and typescript", () => {
		const genOpts: Partial<IGenOptions> = { props: true, typescript: true };

		makeTest({
			name: "should import and use SVGProps",
			framework: FrameworkEnum.REACT,
			genOptions: genOpts,
			tests: (ctx) => {
				testJsxImports({
					code: ctx.component.code,
					named: ["SVGProps"],
					from: "react",
				});

				expect(ctx.component.code).toContain("(props: SVGProps<SVGSVGElement>");
			},
		});

		makeTest({
			name: "should import and use SvgProps and used svg elements",
			framework: FrameworkEnum.REACT_NATIVE,
			genOptions: genOpts,
			tests: (ctx) => {
				testJsxImports({
					code: ctx.component.code,
					default: "Svg",
					named: [
						"SvgProps",
						...ctx.component.svgTransformationInfo.usedReactNativeElements.filter(
							(e) => e !== "Svg",
						),
					],
					from: "react-native-svg",
				});

				expect(ctx.component.code).toContain("(props: SvgProps");
			},
		});

		makeTest({
			name: "should have props with type and JSX import",
			framework: FrameworkEnum.SOLID,
			genOptions: genOpts,
			tests: (ctx) => {
				testJsxImports({
					code: ctx.component.code,
					named: ["JSX"],
					from: "solid-js/jsx-runtime",
				});

				expect(ctx.component.code).toContain(
					"(props: JSX.SvgSVGAttributes<SVGSVGElement>",
				);
			},
		});

		describe("with forwardRef", () => {
			makeTest({
				name: "should have forwardRef",
				framework: FrameworkEnum.REACT,
				genOptions: { ...genOpts, forwardRef: true },
				tests: (ctx) => {
					expect(ctx.component.code).toMatch(
						/forwardRef\s*<\s*SVGSVGElement\s*,\s*SVGProps<SVGSVGElement>\s*>\s*\(\s*\(props,\s*ref\)/gm,
					);
				},
			});

			makeTest({
				name: "should have forwardRef",
				framework: FrameworkEnum.REACT_NATIVE,
				genOptions: { ...genOpts, forwardRef: true },
				tests: (ctx) => {
					expect(ctx.component.code).toMatch(
						/forwardRef\s*<\s*SVGSVGElement\s*,\s*SvgProps\s*>\s*\(\s*\(props,\s*ref\)/gm,
					);
				},
			});
		});
	});

	describe("with props and typescript and props interface", () => {
		const genOpts: Partial<IGenOptions> = {
			props: true,
			typescript: true,
			propsInterface: true,
		};

		makeTest({
			name: "should have IProps interface",
			framework: JSX_FRAMEWORKS,
			genOptions: genOpts,
			tests: (ctx) => {
				let propsExtends = "";
				if (ctx.framework === FrameworkEnum.REACT) {
					propsExtends = " extends SVGProps<SVGSVGElement>";
				} else if (ctx.framework === FrameworkEnum.REACT_NATIVE) {
					propsExtends = " extends SvgProps";
				} else if (ctx.framework === FrameworkEnum.SOLID) {
					propsExtends = " extends JSX.SvgSVGAttributes<SVGSVGElement>";
				}

				expect(ctx.component.code).toContain(`interface IProps${propsExtends}`);
			},
		});

		makeTest({
			name: "props should use IProps",
			framework: JSX_FRAMEWORKS,
			genOptions: genOpts,
			tests: (ctx) => {
				expect(ctx.component.code).toContain("(props: IProps");
			},
		});

		describe("with forwardRef", () => {
			makeTest({
				name: "props should use IProps",
				framework: REACT_FRAMEWORKS,
				genOptions: { ...genOpts, forwardRef: true },
				tests: (ctx) => {
					expect(ctx.component.code).toMatch(
						/forwardRef\s*<\s*SVGSVGElement\s*,\sIProps\s*>\s*\(\s*\(props,\s*ref\)/gm,
					);
				},
			});
		});
	});


	makeTest({
		name: "should not have xlmns attribute on Svg",
		framework: FrameworkEnum.REACT_NATIVE,
		tests: (ctx) => {
      expect(ctx.svgEl.properties).not.haveOwnProperty('xmlns')
		},
	});
});
