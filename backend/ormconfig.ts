import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PARTNER_DB_HOST,
  port: Number(process.env.PARTNER_DB_PORT),
  username: process.env.PARTNER_DB_USER,
  password: process.env.PARTNER_DB_PASSWORD,
  database: process.env.PARTNER_DB_NAME,
  entities: ['appss/menu-service/**/*.entity{.ts,.js}'],
  migrations: ['database/migrations/partners/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});
