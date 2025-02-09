import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the datum',
    example: 'My Important Data',
  })
  title: string;

  @ApiProperty({
    description: 'Array of tags associated with the datum',
    example: ['tag1', 'tag2'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'The number of results to return',
    example: 10,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'The page number to return',
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  offset: number;
}
