import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
