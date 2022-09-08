import { Static, Type as T } from '@sinclair/typebox';

export const SvgNodeSchema = T.Object({
  id: T.String(),
  bytes: T.Array(T.Number(), { minItems: 1 }),
});

export type ISvgNode = Static<typeof SvgNodeSchema>;
