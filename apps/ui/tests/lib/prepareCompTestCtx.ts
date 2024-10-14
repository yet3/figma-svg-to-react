import {
	extractSvgCodeFromCompCode,
	makeDefaultComponent,
	regenerateComponent,
} from "@lib";
import { makeDefaultGenOptions } from "@shared/lib";
import {
	FrameworkEnum,
	type IGenOptions,
	type ISvgValues,
} from "@shared/types";
import { type ElementNode, parse as parseSvg } from "svg-parser";
import { makeTestOgSvg } from "./consts";

interface IOpts {
	genOptions: Partial<IGenOptions>;
	svgValues?: ISvgValues;
	framework?: FrameworkEnum;
	svgCode: string;
}
export const prepareCompTestCtx = async (opts: IOpts) => {
	let genOpts = makeDefaultGenOptions();
	for (const key in genOpts) {
		genOpts[key] = false;
	}
	genOpts = {
		...genOpts,
		...opts.genOptions,
	};

	const ogSvg = makeTestOgSvg();
	ogSvg.data = opts.svgCode;

	const comp = makeDefaultComponent(ogSvg);
	if (opts.svgValues) {
		comp.svgValues = opts.svgValues;
	}

	const regeneratedComponent = await regenerateComponent({
		originalSvg: ogSvg,
		currentComponent: comp,
		genOptions: genOpts,
		framework: opts.framework ?? FrameworkEnum.SVG,
	});

	const beforeParsedSvg = parseSvg(opts.svgCode);
	const parsedSvg = parseSvg(
		extractSvgCodeFromCompCode(regeneratedComponent.code).replaceAll(
			"{...props}",
			"",
		),
	);

	return {
		framework: opts.framework,
		component: regeneratedComponent,
		beforeSvgEl: beforeParsedSvg.children[0] as ElementNode,
		svgEl: parsedSvg.children[0] as ElementNode,
	};
};

export type ICompTestCtx = Awaited<ReturnType<typeof prepareCompTestCtx>>;
