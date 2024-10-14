import type { PluginConfig } from "svgo";
import type { DeepPartial } from "./common";
import type { FrameworkEnum } from "./framework";
import type { IGenOptions } from "./genOptions";
import type {
	IDefaultSvgValues,
	IOriginalSvg,
	ISvgTransformationInfo,
	ISvgValues,
} from "./svg";

export interface ISvgoOpts {
	originalSvg: IOriginalSvg;
	framework: FrameworkEnum;
	genOptions: IGenOptions;
	svgValues: ISvgValues;
}

export interface ISvgoCtx extends ISvgoOpts {
	isReact: boolean;

	updateDefaultValues: (val: DeepPartial<IDefaultSvgValues>) => void;
	updateTransformationInfo: (val: DeepPartial<ISvgTransformationInfo>) => void;
}

export type ISvgoPluginFn = (ctx: ISvgoCtx) => PluginConfig;
