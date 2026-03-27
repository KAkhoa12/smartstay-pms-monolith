import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config({ override: true });

const toBool = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value == null) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: (process.env.DB_TYPE as 'postgres') ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'auth_service',
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: toBool(process.env.DB_SYNCHRONIZE, true),
  logging: toBool(process.env.DB_LOGGING, false),
});
