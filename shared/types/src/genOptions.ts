import type { FrameworkEnum } from "./framework";

export interface IGenOptionDisabledData {
	isDisabled?: boolean;
	reasons: string[];
}

type IGenOptionMetadisabledWhenFn = (data: {
	genOptions: IGenOptions;
	framework: FrameworkEnum;
}) => IGenOptionDisabledData;

export type IGenOptionMeta = {
	displayName: string;
	defaultValue: boolean;
	disabledWhen?: IGenOptionMetadisabledWhenFn;
	frameworks: FrameworkEnum[];

	style?: {
		isBold?: boolean;
	};
};

export interface IGenOptionsMeta {
	removeTitle: IGenOptionMeta;
	removeWidth: IGenOptionMeta;
	removeHeight: IGenOptionMeta;
	removeViewbox: IGenOptionMeta;
	removeAllFillAttributes: IGenOptionMeta;
	removeAllStrokeAttributes: IGenOptionMeta;
	iconMode: IGenOptionMeta;
	bemClasses: IGenOptionMeta;
	classOnlyOnSvg: IGenOptionMeta;
	nodesNamesToClasses: IGenOptionMeta;

	// Component
	props: IGenOptionMeta;
	spreadProps: IGenOptionMeta;
	namedExport: IGenOptionMeta;
	forwardRef: IGenOptionMeta;

	// Typescript
	typescript: IGenOptionMeta;
	propsInterface: IGenOptionMeta;
	allowImportAsType: IGenOptionMeta;

	// React
	useReactLowerThan19: IGenOptionMeta;
	importAllAsReact: IGenOptionMeta;
}

export type IGenOptionsMetaKeys = keyof IGenOptionsMeta;

export type IGenOptions = Record<IGenOptionsMetaKeys, boolean>;
export type IGenOptionsKeys = keyof IGenOptions;
export type IFrameworkGenOptions = Record<FrameworkEnum, IGenOptions>;
