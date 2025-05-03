import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ProjectStatus } from '@architecture-firm/shared/dist/types/project';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsEnum(ProjectStatus)
  status: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
