import * as dotenv from 'dotenv';
dotenv.config();

// Require the framework
import Fastify from 'fastify';

// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
})

app.register(import('./function'), {
  prefix: '/',
});

export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};
