import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';
import { createClient, RedisClientType } from 'redis';
import { LogsDto } from '../data/dto/logs.dto';
import { redisConfig } from '../config/config';

class RedisStorage {
  private static instance: RedisStorage;
  private client: RedisClientType;

  private constructor(
    url: string = redisConfig.url,
    password: string = redisConfig.password,
  ) {
    this.client = createClient({
      url: url,
      password: password,
    });

    this.client.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  async logExecutionTime(
    executionTime: number,
    endpoint: string,
    method: string,
    timestamp: string,
  ) {
    const apiName = `${endpoint}-${method}`;

    await this.client
      .sendCommand(['TS.CREATE', apiName, 'RETENTION', '86400000'])
      .catch(console.log);

    const command = ['TS.ADD', apiName, timestamp, executionTime.toString()];
    await this.client.sendCommand(command);
  }

  public async getExecutionTime(
    logsDto: LogsDto,
  ): Promise<RedisCommandRawReply> {
    const { endpoint, method, from, to } = logsDto;
    const fromDate = new Date(from).getTime().toString();
    const toDate = new Date(to).getTime().toString();
    const apiName = `${endpoint}-${method.toUpperCase()}`;

    const command = ['TS.RANGE', apiName, fromDate, toDate];
    const data = await this.client.sendCommand(command).catch(() => []);

    return data;
  }

  public static getInstance(): RedisStorage {
    if (!RedisStorage.instance) {
      RedisStorage.instance = new RedisStorage();
    }
    return RedisStorage.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error: unknown) {
      console.error('Failed to connect to Redis:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown Redis connection error',
      );
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error: unknown) {
      console.error('Failed to disconnect from Redis:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown Redis disconnection error',
      );
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }
}

export default RedisStorage.getInstance();
