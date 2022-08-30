export type OptionsKeys =
  | "includeImportReact"
  | "asIcon"
  | "forReactNative"
  | "forwardRef"
  | "propsInterface"
  | "namedExport"
  | "typescript"
  | "withProps"
  | "withViewbox";

export type IOptions = { [key in OptionsKeys]: Option };
export type API_Options = { [key in OptionsKeys]: boolean };

export interface Option {
  label: string;
  value: boolean;
  onlyIf?: Array<OptionsKeys>;
}

export interface SvgChangable {
  compName?: string;
  fileName?: string;
}

export interface ISvg {
  id: string;
  originalBytes: number[]
  data: string;
  nodeName: string;
  compName: string;
  fileName: string;
}

export interface ExportSvg {
  id: string;
  bytes: number[];
  nodeName: string;
}

export interface API_Request {
  svgs: ExportSvg[];
  options: {
    includeImportReact: boolean;
    asIcon: boolean;
    forReactNative: boolean;
    forwardRef: boolean;
    propsInterface: boolean;
    namedExport: boolean;
    typescript: boolean;
    withProps: boolean;
    withViewbox: boolean;
  };
}

export interface API_Response {
  svgs: ISvg[];
  errors?: string;
}

export type Actions =
  | { type: "notify"; msg: string }
  | { type: "closePlugin" }
  | { type: "saveOptions"; options: { [key in OptionsKeys]?: boolean } };
