import { Static, Type as T } from '@sinclair/typebox';
import { SvgNodeSchema } from './svg.schema';
import { OptionsSchema } from './options.schema';

export const ApiReqBodySchema = T.Object({
  svgs: T.Array(SvgNodeSchema, { minItems: 1 }),
  options: OptionsSchema,
});

export const ApiReplySvgSchema = T.Object({
  id: T.String(),
  data: T.String(),
});

export const ApiReply200Schema = T.Object({
  svgs: T.Array(ApiReplySvgSchema),
});

export const ApiReply500Schema = T.Object({
  errors: T.String(),
});

export const ApiReplySchema = T.Object({
  200: ApiReply200Schema,
  500: ApiReply500Schema,
});

export type IApiReqBody = Static<typeof ApiReqBodySchema>;
export type IApiReplySvg = Static<typeof ApiReplySvgSchema>;

export interface IApiReply200 {
  svgs: Static<typeof ApiReplySchema>[200]['svgs'];
  errors?: never;
}

export interface IApiReply500 {
  svgs?: never;
  errors: Static<typeof ApiReplySchema>[500]['errors'];
}

export type IApiReply = IApiReply200 | IApiReply500;

