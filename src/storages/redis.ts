import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';

class RedisStorage {
  private static instance: RedisStorage;
  private client: RedisClientType;

  private constructor(url: string = 'redis://localhost:6379') {
    this.client = createClient({
      url: url,
      password:
        process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81',
    });

    this.client.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
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
