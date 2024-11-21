import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { ExternalConfig } from './external.config';
import { FileConfig } from './file.config';

export { AppConfig, Environment, default as appConfig } from './app.config';
export { DatabaseConfig, default as databaseConfig } from './database.config';
export { ExternalConfig, default as externalConfig } from './external.config';
export { FileConfig, FileDriver, default as fileConfig } from './file.config';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  external: ExternalConfig;
  file: FileConfig;
};

export const temp = 'temp 13';
