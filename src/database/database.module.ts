// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config'; 

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
