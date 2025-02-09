import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GetAnalyticsDto } from './dto/get-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  findAll(@Query() logsDto: GetAnalyticsDto) {
    return this.analyticsService.findAll(logsDto);
  }
}
