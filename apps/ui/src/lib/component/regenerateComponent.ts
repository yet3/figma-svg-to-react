import {
	ComponentStatus,
	type FrameworkEnum,
	type IComponent,
	type IGenOptions,
	type IOriginalSvg,
} from "@shared/types";
import { SVG_PLACEHOLDER_PREFIX } from "../consts";
import { generateOptimizedSvg } from "../svgo";
import { formatComponent } from "./formatComponent";
import { COMPONENT_GENERATORS } from "./generators";
import { resolveFinalGenOptions } from "./resovleFinalGenOptions";

interface IOpts {
	originalSvg: IOriginalSvg;
	currentComponent: IComponent;
	genOptions: IGenOptions;
	framework: FrameworkEnum;
}

export const regenerateComponent = async ({
	genOptions: ogGenOptions,
	currentComponent,
	framework,
	originalSvg,
}: IOpts): Promise<IComponent> => {
	const genOptions = resolveFinalGenOptions({
		genOptions: ogGenOptions,
		framework,
	});

	const { svgCode, svgDefaultValues, svgTransformationInfo } =
		generateOptimizedSvg({
			originalSvg,
			framework,
			genOptions,
			svgValues: currentComponent.svgValues,
		});

	let code = svgCode;

	const generator = COMPONENT_GENERATORS[framework];
	if (generator) {
		const result = await generator({
			svgCode: svgCode,
			svgTransformationInfo: svgTransformationInfo,
			genOptions,
			componentName: currentComponent.componentName,
		});
		code = result.code;
	}

	// remove all unresolved placeholders
	code = code.replaceAll(
		new RegExp(`${SVG_PLACEHOLDER_PREFIX}[^=]*=""`, "gm"),
		"",
	);

	return {
		...currentComponent,
		status: ComponentStatus.READY,
		code: await formatComponent(code, framework),
		svgDefaultValues,
		svgTransformationInfo,
	};
};
