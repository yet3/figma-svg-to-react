import {
	ComponentStatus,
	type IComponent,
	type IDefaultSvgValues,
	type IOriginalSvg,
	type ISvgTransformationInfo,
} from "@shared/types";
import { strToComponentName } from "./componentName";

export const makeDefaultTransformationInfo = (): ISvgTransformationInfo => ({
	removedAttributes: [],
	removedElements: [],
	usedReactNativeElements: [],
});

export const makeDefaultSvgValues = (): IDefaultSvgValues => ({
	title: "",
	width: "",
	height: "",
	viewBox: "",
});

export const makeDefaultComponent = (ogSvg: IOriginalSvg): IComponent => ({
	svgId: ogSvg.id,

	status: ComponentStatus.GENERATING,

	code: null,

	fileName: strToComponentName(ogSvg.nodeName),
	componentName: strToComponentName(ogSvg.nodeName),

	svgTransformationInfo: makeDefaultTransformationInfo(),
	svgDefaultValues: makeDefaultSvgValues(),
	svgValues: {},

	genError: null,
});

export const SVG_PLACEHOLDER_PREFIX = "SPP_";

// make placeholder
const mp = (...segments: string[]) => {
	return `${SVG_PLACEHOLDER_PREFIX}${segments.join("_")}`;
};

export const SVG_PLACEHOLDERS = {
	ATTRS: {
		SPREAD_PROPS: mp("SPREAD", "PROPS"),
		REF: mp("REF"),
	},
};
