import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAnalyticsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The endpoint of the API',
    example: '/api/v1/users',
  })
  endpoint: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The method of the API',
    example: 'GET',
  })
  method: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The from date of the API',
    example: '2024-01-01',
  })
  from: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The to date of the API',
    example: '2024-01-01',
  })
  to: string;
}
