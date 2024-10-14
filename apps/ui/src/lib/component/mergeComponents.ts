import type { DeepPartial, IComponent, ISvgValues } from "@shared/types";

export const mergeComponents = (
	base: IComponent,
	toMerge: DeepPartial<IComponent>,
): IComponent => {
	const svgValues: ISvgValues = {
		...base.svgValues,
		...toMerge.svgValues,
	};

	for (const key in svgValues) {
		if (svgValues[key] === undefined) {
			delete svgValues[key];
		}
	}

	return {
		...base,
		...toMerge,
		svgTransformationInfo: {
			...base.svgTransformationInfo,
			...toMerge.svgTransformationInfo,
		},
		svgDefaultValues: {
			...base.svgDefaultValues,
			...toMerge.svgDefaultValues,
		},
		svgValues,
	};
};
