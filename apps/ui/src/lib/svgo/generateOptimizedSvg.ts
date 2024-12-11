import { makeDefaultSvgValues, makeDefaultTransformationInfo } from "@lib";
import { REACT_FRAMEWORKS } from "@shared/lib";
import type { ISvgOptimizationInfo, ISvgoCtx, ISvgoOpts } from "@shared/types";
import { optimize } from "svgo";
import {
	iconMode,
	insertClasses,
	insertPlaceholders,
	insertValues,
	removeAttributes,
	removeUnknownsAndDefaults,
	svgoDefaultPreset,
	toJsx,
} from "./plugins";

interface IResult extends ISvgOptimizationInfo {
	svgCode: string;
}

export const generateOptimizedSvg = (opts: ISvgoOpts): IResult => {
	const { originalSvg, framework } = opts;

	let svgDefaultValues = makeDefaultSvgValues();
	const svgTransformationInfo = makeDefaultTransformationInfo();

	const ctx: ISvgoCtx = {
		...opts,
		isReact: REACT_FRAMEWORKS.includes(framework),
		updateDefaultValues: (val) => {
			svgDefaultValues = {
				...svgDefaultValues,
				...val,
			};
		},
		updateTransformationInfo: (val) => {
			if (val.removedElements) {
				svgTransformationInfo.removedElements = [
					...new Set([
						...svgTransformationInfo.removedElements,
						...val.removedElements,
					]),
				];
			}

			if (val.removedAttributes) {
				svgTransformationInfo.removedAttributes = [
					...new Set([
						...svgTransformationInfo.removedAttributes,
						...val.removedAttributes,
					]),
				];
			}

			if (val.usedReactNativeElements) {
				svgTransformationInfo.usedReactNativeElements = [
					...new Set([
						...svgTransformationInfo.usedReactNativeElements,
						...val.usedReactNativeElements,
					]),
				];
			}
		},
	};

	const output = optimize(originalSvg.data, {
		multipass: true,
		// order of plugins matters
		plugins: [
			// insertValues should be first so we can capture defaultValues
			insertValues(ctx),
			// insertClasses must run before svgoDefaultPreset so that it can access svg ids
			insertClasses(ctx),
			svgoDefaultPreset(ctx),
			removeUnknownsAndDefaults(ctx),
			iconMode(ctx),
			removeAttributes(ctx),
			toJsx(ctx),
			// insertPlaceholders should be last
			insertPlaceholders(ctx),
		].filter((plug) => plug),
	});

	return {
		svgCode: output.data,
		svgDefaultValues,
		svgTransformationInfo,
	};
};
