import { Injectable } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import MongoClient from '../storages/mongodb';
import { Collection } from 'mongodb';
import RedisStorage from '../storages/redis';
import KafkaProducerService from '../services/kafka';
import { searchByTitleAndTags } from '../services/stackoverflow';
import { SearchResultDto } from './dto/search-results.dto';
import { kafkaConfig, mongoConfig } from '../config/config';
import { QueryRepository } from './query.repository';

@Injectable()
export class QueryService {
  private readonly dataCollection: Collection;
  private readonly redisClient: typeof RedisStorage;
  private readonly kafkaProducerService: typeof KafkaProducerService;
  private readonly queryRepository: QueryRepository;

  constructor() {
    this.dataCollection = MongoClient.getCollection(mongoConfig.collection);
    this.redisClient = RedisStorage;
    this.kafkaProducerService = KafkaProducerService;
    this.queryRepository = new QueryRepository();
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
      const { insertedId } = await this.queryRepository.addQuery(mongoData);

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

      this.kafkaProducerService // we don't have to await this
        .sendMessage(kafkaConfig.topic, kafkaMessage)
        .catch(console.error);

      return results;
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  async searchNative(
    searchDto: SearchDto,
    endpointName: string,
    method: string,
  ): Promise<SearchResultDto[]> {
    const startTime = Date.now();
    const results = await this.queryRepository.findByTitle(searchDto);

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
