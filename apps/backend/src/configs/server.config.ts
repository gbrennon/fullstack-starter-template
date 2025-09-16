import type { ServerOptions } from '../server/server';
import { get } from 'env-var';
import { config } from 'dotenv';
config({ path: process.env.DOTENV_CONFIG_PATH || undefined });

export const serverConfig: ServerOptions = {
  environment: get('NODE_ENV')
    .required()
    .asEnum(['development', 'production', 'test', 'local']),

  port: get('APP_PORT').required().asPortNumber(),
  prefix: get('API_PREFIX').required().asString(),
};
