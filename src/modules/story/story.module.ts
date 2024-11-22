import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Story } from '@/database/entities/Story';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AliasModule } from '../alias/alias.module';
import { Genre } from '@/database/entities/Genre';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Genre]), AliasModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService]
})
export class StoryModule {}
