import type { IOptions } from '../serverless/schemas/options.schema';
import { ISvgNode } from '../serverless/schemas/svg.schema';

export type OptionsKeys = keyof IOptions;
export type API_Options = { [key in OptionsKeys]: boolean };

export interface Option {
  label: string;
  value: boolean;
  onlyIf?: Array<OptionsKeys>;
}
export type IOptionsWithDetails = { [key in OptionsKeys]: Option };

export interface SvgEditable {
  compName?: string;
  fileName?: string;
}

export interface ISvg {
  id: string;
  originalBytes: number[];
  data: string;
  nodeName: string;
  compName: string;
  fileName: string;
}

export interface IExportSvg extends ISvgNode {
 nodeName: string; 
}

export type Actions =
  | { type: 'notify'; msg: string }
  | { type: 'closePlugin' }
  | { type: 'saveOptions'; options: { [key in OptionsKeys]?: boolean } };
