import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ApiReply200Schema, ApiReply500Schema, ApiReqBodySchema, IApiReply, IApiReqBody } from '../schemas/api.schema';
import { transformSvg } from './transformSvg';
import cors from '@fastify/cors';

export default async function (instance: FastifyInstance, opts: FastifyServerOptions, done) {
  instance.withTypeProvider<TypeBoxTypeProvider>()

  instance.register(cors);

  instance.post<{ Body: IApiReqBody; Reply: IApiReply }>(
    '/',
    { bodyLimit: 10 * 1024 * 1024, schema: { body: ApiReqBodySchema, response: { 200: ApiReply200Schema, 500: ApiReply500Schema } } },
    async (req, reply) => {
      const { svgs, options } = req.body;

      try {
        const promises = [];

        svgs.forEach((svg) => {
          promises.push(
            new Promise(async (resolve, reject) => {
              const data = await transformSvg(svg, options);

              if (!data) reject(`Error during transformation of node: ${svg.id}`);
              else {
                resolve({
                  id: svg.id,
                  data,
                });
              }
            })
          );
        });

        const resSvgs = (await Promise.all(promises)) ?? [];
        reply.status(200).send({ svgs: resSvgs });
      } catch (e) {
        console.log('error', e);
        reply.status(500).send({
          errors: "Couldn't parse SVG",
        });
      }
    }
  );

  done();
}
