import type { FrameworkEnum } from "./framework";
import type { IGenOptions } from "./genOptions";
import type {
	ISvgOptimizationInfo,
	ISvgTransformationInfo,
	ISvgValues,
} from "./svg";

export enum ComponentStatus {
	READY = "READY",
	GENERATING = "GENERATING",
	ERROR = "ERROR",
}

export interface IComponent extends ISvgOptimizationInfo {
	svgId: string;
	status: ComponentStatus;

	code: string | null;

	componentName: string;
	fileName: string;

	svgValues: ISvgValues;

	genError?: string | null;
}

export type IFrameworkComponents = {
	[key in FrameworkEnum]: IComponent[];
};

export type IComponentGeneratorResult = {
	code: string;
};
export type IComponentGenerator = (data: {
	svgCode: string;
	svgTransformationInfo: ISvgTransformationInfo;
	genOptions: IGenOptions;
	componentName: string;
}) => Promise<IComponentGeneratorResult>;
