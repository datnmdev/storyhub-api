import { Module } from '@nestjs/common';
import { AliasService } from './alias.service';
import { AliasController } from './alias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alias } from '@/database/entities/Alias';

@Module({
	imports: [TypeOrmModule.forFeature([Alias])],
	controllers: [AliasController],
	providers: [AliasService],
	exports: [AliasService],
})
export class AliasModule {}
