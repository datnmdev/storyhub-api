import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterImageDto } from './create-chapter-image.dto';

export class UpdateChapterImageDto extends PartialType(CreateChapterImageDto) {}
