import { MongoClient as MC, Db, Collection } from 'mongodb';

class MongoClient {
  private static instance: MongoClient;
  private client: MC | null = null;
  private db: Db | null = null;
  private uri: string;

  private constructor() {
    const host = process.env.NODE_ENV === 'production' ? 'mongo' : 'localhost';
    this.uri = `mongodb://${process.env.MONGO_USER || 'root'}:${
      process.env.MONGO_PASSWORD || 'example'
    }@${host}:27017`;
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
      this.db = this.client.db(process.env.MONGODB_DB_NAME || 'myapp');
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
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

export default MongoClient.getInstance();
