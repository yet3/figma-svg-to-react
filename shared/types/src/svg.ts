import type { FrameworkEnum } from "./framework";
import type { IGenOptions } from "./genOptions";

export interface IExportSvg {
	id: string;
	bytes: Uint8Array;
	nodeName: string;
}

export interface IOriginalSvg {
	id: string;
	nodeName: string;
	data: string;
}
export type IOriginalSvgs = Record<string, IOriginalSvg>;

export interface IDefaultSvgValues {
	title: string;
	width: string;
	height: string;
	viewBox: string;
}
export interface ISvgValues {
	title?: string | null;
	width?: string | null;
	height?: string | null;
	viewBox?: string | null;
}

export interface ISvgTransformationInfo {
	usedReactNativeElements: string[];
	removedElements: string[];
	removedAttributes: string[];
}

export interface ISvgOptimizationInfo {
	svgDefaultValues: IDefaultSvgValues;
	svgTransformationInfo: ISvgTransformationInfo;
}
