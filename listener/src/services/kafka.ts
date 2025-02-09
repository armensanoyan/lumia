import { Kafka, Producer, EachMessagePayload } from 'kafkajs';
import { kafkaConfig, mongoConfig } from '../config/config';
import MongoClient from '../storages/mongodb';
import { Collection } from 'mongodb';

class KafkaProducerService {
  private producer: Producer;
  private kafka: Kafka;
  private mongoClient: typeof MongoClient;
  private mongoLogsCollection: Collection;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: [kafkaConfig.url],
    });

    this.producer = this.kafka.producer();
    this.mongoClient = MongoClient;
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('Successfully connected to Kafka');
    } catch (error: unknown) {
      console.error('Error connecting to Kafka:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('Successfully disconnected from Kafka');
    } catch (error: unknown) {
      console.error('Error disconnecting from Kafka:', error);
      throw error;
    }
  }

  async listen(topic: string) {
    const consumer = this.kafka.consumer({ groupId: kafkaConfig.groupId });

    this.mongoLogsCollection = this.mongoClient.getCollection(
      mongoConfig.collection,
    );

    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        try {
          const data = JSON.parse(message.value?.toString() || '{}') as Record<
            string,
            unknown
          >;
          await this.mongoLogsCollection.insertOne(data);
          console.log('Stored message:', data);
        } catch (error) {
          console.error('Error processing message:', error);
        }

        return Promise.resolve();
      },
    });
  }
}

export default new KafkaProducerService();
