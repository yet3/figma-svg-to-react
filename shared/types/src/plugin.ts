import type { FrameworkEnum } from "./framework";
import type { IFrameworkGenOptions } from "./genOptions";
import type { IExportSvg } from "./svg";

export enum PluginMessageKind {
	INIT = "INIT",
	CLOSE_PLUGIN = "CLOSE_PLUGIN",
	SAVE_SELECTED_FRAMEWORK = "SAVE_SELECTED_FRAMEWORK",
	SAVE_GEN_OPTIONS = "SAVE_GEN_OPTIONS",
	NOTIFY = "NOTIFY",
}

export type TPluginMessageMaker<
	TKind extends PluginMessageKind,
	TData extends Record<string, unknown> = Record<string, unknown>,
> = {
	kind: TKind;
} & TData;

export type IPluginMessageInit = TPluginMessageMaker<
	PluginMessageKind.INIT,
	{
		svgs: IExportSvg[];
		framework: FrameworkEnum;
		genOptions: Partial<IFrameworkGenOptions>;
	}
>;

export type IPluginMessageSaveSelectedFramework = TPluginMessageMaker<
	PluginMessageKind.SAVE_SELECTED_FRAMEWORK,
	{
		framework: FrameworkEnum;
	}
>;

export type IPluginMessageSaveGenOptions = TPluginMessageMaker<
	PluginMessageKind.SAVE_GEN_OPTIONS,
	{
		genOptions: IFrameworkGenOptions;
	}
>;

export type IPluginMessageNotify = TPluginMessageMaker<
	PluginMessageKind.NOTIFY,
	{
		msg: string;
	}
>;

export type IPluginMessage =
	| IPluginMessageInit
	| IPluginMessageSaveSelectedFramework
	| IPluginMessageSaveGenOptions
	| IPluginMessageNotify
	| TPluginMessageMaker<PluginMessageKind.CLOSE_PLUGIN>;

export type IPluginMessageEvent = MessageEvent<{
	pluginId: string;
	pluginMessage: IPluginMessage;
}>;
