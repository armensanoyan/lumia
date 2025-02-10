import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { QueryService } from './query.service';
import { SearchDto } from './dto/search.dto';
import { SearchResultDto } from './dto/search-results.dto';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Get('native-search')
  searchNative(
    @Query() searchDto: SearchDto,
    @Req() request: Request,
  ): Promise<SearchResultDto[]> {
    const endpointName = request.url.split('?')[0];
    const method = request.method;

    return this.queryService.searchNative(searchDto, endpointName, method);
  }

  @Get()
  findAll(
    @Query() searchDto: SearchDto,
    @Req() request: Request,
  ): Promise<SearchResultDto[]> {
    const endpointName = request.url.split('?')[0];
    const method = request.method;

    return this.queryService.findAll(searchDto, endpointName, method);
  }
}
