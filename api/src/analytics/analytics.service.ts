import { Injectable } from '@nestjs/common';
import { GetAnalyticsDto } from './dto/get-analytics.dto';
import RedisStorage from '../storages/redis';

@Injectable()
export class AnalyticsService {
  private readonly redisClient: typeof RedisStorage;

  constructor() {
    this.redisClient = RedisStorage;
  }

  async findAll(logsDto: GetAnalyticsDto) {
    try {
      return await this.redisClient.getExecutionTime(logsDto);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }
}
