import { IOptionsWithDetails } from './custom';

export const OPTIONS: IOptionsWithDetails = {
  typescript: { label: 'Typescript', value: true },
  withProps: { label: 'With props', value: true },
  propsInterface: {
    label: 'Props interface',
    value: true,
    onlyIf: ['typescript', 'withProps'],
  },
  includeImportReact: { label: 'Include: import * as React', value: false },
  withViewbox: { label: 'With viewbox', value: true },
  asIcon: { label: 'Icon (width, height = 1em)', value: false },
  namedExport: { label: 'Named export', value: true },
  forwardRef: { label: 'ForwardRef', value: false },
  removeAllFill: { label: 'Remove all "fill" attributes', value: false },
  removeAllStroke: { label: 'Remove all "stroke" attributes', value: false },
  addClassNames: { label: "Add classNames names", value: false },
  makeClassNamesExact: { label: 'Make classNames exact', onlyIf: ['addClassNames'], value: false },
  forReactNative: { label: 'For react native', value: false },
};

export const OPTIONS_KEYS = Object.keys(OPTIONS);
