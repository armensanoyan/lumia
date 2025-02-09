import { Injectable } from '@nestjs/common';
import { GetAnalyticsDto } from './dto/get-analytics.dto';
import RedisStorage from '../storages/redis';

@Injectable()
export class AnalyticsService {
  private readonly redisClient: typeof RedisStorage;

  constructor() {
    this.redisClient = RedisStorage;
  }

  findAll(logsDto: GetAnalyticsDto) {
    return this.redisClient.getExecutionTime(logsDto);
  }
}
