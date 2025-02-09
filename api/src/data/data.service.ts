import { Injectable } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import MongoClient from '../storages/mongodb';
import { Collection } from 'mongodb';
import RedisStorage from '../storages/redis';
import KafkaProducerService from '../services/kafka';
import { searchByTitleAndTags } from '../services/stackoverflow';
import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';
import { LogsDto } from './dto/logs.dto';
import { SearchResultDto } from './dto/search-results.dto';
import { kafkaConfig, mongoConfig } from '../config/config';

@Injectable()
export class DataService {
  private readonly dataCollection: Collection;
  private readonly redisClient: typeof RedisStorage;
  private readonly kafkaProducerService: typeof KafkaProducerService;

  constructor() {
    this.dataCollection = MongoClient.getCollection(mongoConfig.collection);
    this.redisClient = RedisStorage;
    this.kafkaProducerService = KafkaProducerService;
  }

  async findAll(
    searchDto: SearchDto,
    endpointName: string,
    method: string,
  ): Promise<SearchResultDto[]> {
    try {
      const startTime = Date.now();
      const results = await searchByTitleAndTags(searchDto);
      const mongoData = {
        ...searchDto,
        results,
      };
      const { insertedId } = await this.dataCollection.insertOne(mongoData);

      const executionTime = Date.now() - startTime;

      await this.redisClient.logExecutionTime(
        Math.floor(executionTime),
        endpointName,
        method,
        startTime.toString(),
      );

      const kafkaMessage = {
        id: insertedId,
        startTime,
        title: searchDto.title,
        tags: searchDto.tags,
      };

      await this.kafkaProducerService.sendMessage(
        kafkaConfig.topic,
        kafkaMessage,
      );

      return results;
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  async getExecutionTime(logsDto: LogsDto): Promise<RedisCommandRawReply> {
    return this.redisClient.getExecutionTime(logsDto);
  }

  async searchNative(
    searchDto: SearchDto,
    endpointName: string,
    method: string,
  ): Promise<SearchResultDto[]> {
    const { title, limit = 10, offset = 0 } = searchDto;

    const startTime = Date.now();
    const results = await this.dataCollection
      .find<SearchResultDto>({ title }) // TODO: partial match on title
      .skip(offset)
      .limit(limit)
      .toArray();

    const executionTime = Date.now() - startTime;

    await this.redisClient.logExecutionTime(
      Math.floor(executionTime),
      endpointName,
      method,
      startTime.toString(),
    );

    return results;
  }
}
