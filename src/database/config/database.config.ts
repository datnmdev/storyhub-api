import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<DataSourceOptions> => ({
  type: 'mysql',
  host: configService.get('HOST_DB'),
  port: +configService.get('PORT_DB'),
  username: configService.get('USERNAME_DB'),
  password: configService.get('PASSWORD_DB'),
  database: configService.get('DB_NAME'),
  entities: ['dist/**/entities/*.{ts,js}'],
  synchronize: false,
  logging: false,
  logger: 'advanced-console',
});
