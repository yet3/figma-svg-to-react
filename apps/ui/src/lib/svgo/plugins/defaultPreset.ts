import type { ISvgoPluginFn } from "@shared/types";

const falseOrUndefined = (when: boolean): false | undefined => {
	return when ? undefined : false;
};

export const svgoDefaultPreset: ISvgoPluginFn = ({
	genOptions,
	svgValues,
}) => ({
	name: "preset-default",
	params: {
		overrides: {
			removeUnknownsAndDefaults: false,
			removeTitle: falseOrUndefined(
				genOptions.removeTitle && svgValues.title == null,
			),
			removeViewBox: falseOrUndefined(
				genOptions.removeViewbox && svgValues.viewBox == null,
			),
		},
	},
});
