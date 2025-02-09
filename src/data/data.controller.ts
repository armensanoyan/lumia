import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { DataService } from './data.service';
import { SearchDto } from './dto/search.dto';
import { LogsDto } from './dto/logs.dto';
import { SearchResultDto } from './dto/search-results.dto';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('execution-time')
  getExecutionTime(@Query() logsDto: LogsDto) {
    return this.dataService.getExecutionTime(logsDto);
  }

  @Get('native')
  searchNative(@Query() searchDto: SearchDto): Promise<SearchResultDto[]> {
    return this.dataService.searchNative(searchDto);
  }

  @Get()
  findAll(
    @Query() searchDto: SearchDto,
    @Req() request: Request,
  ): Promise<SearchResultDto[]> {
    const endpointName = (request.url || '/data').split('?')[0];
    const method = request.method;

    return this.dataService.findAll(searchDto, endpointName, method);
  }
}
