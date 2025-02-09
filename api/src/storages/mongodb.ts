import { MongoClient as MC, Db, Collection } from 'mongodb';
import { mongoConfig } from '../config/config';

const { url, database, collection } = mongoConfig;

class MongoClient {
  private static instance: MongoClient;
  private client: MC | null = null;
  private db: Db | null = null;
  private uri: string;

  private constructor() {
    this.uri = url;
  }

  public static getInstance(): MongoClient {
    if (!MongoClient.instance) {
      MongoClient.instance = new MongoClient();
    }
    return MongoClient.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.client = await MC.connect(this.uri);
      this.db = this.client.db(database);

      await this.db
        .collection(collection)
        .createIndex({ title: 1 }, { background: true }); // Add tags in case of searching by tags

      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        console.log('Successfully disconnected from MongoDB.');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db.collection(name);
  }
}

const mongoClient = MongoClient.getInstance();

export default mongoClient;
