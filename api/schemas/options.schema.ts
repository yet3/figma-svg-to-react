import { Static, Type as T } from '@sinclair/typebox';

export const OptionsSchema = T.Object({
  typescript: T.Boolean(),
  includeImportReact: T.Boolean(),
  asIcon: T.Boolean(),
  forReactNative: T.Boolean(),
  forwardRef: T.Boolean(),
  propsInterface: T.Boolean(),
  namedExport: T.Boolean(),
  withProps: T.Boolean(),
  withViewbox: T.Boolean(),
});

export type IOptions = Static<typeof OptionsSchema>;
