import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { kafkaConfig } from '../config/config';

class KafkaProducerService {
  private producer: Producer;
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: [kafkaConfig.url],
    });

    this.producer = this.kafka.producer();
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

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      const producerRecord: ProducerRecord = {
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      };

      await this.producer.send(producerRecord);
      console.log(`Message sent to topic ${topic} successfully`);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendBatchMessages(topic: string, messages: any[]): Promise<void> {
    try {
      const producerRecord: ProducerRecord = {
        topic,
        messages: messages.map((message) => ({
          value: JSON.stringify(message),
        })),
      };

      await this.producer.send(producerRecord);
      console.log(`Batch messages sent to topic ${topic} successfully`);
    } catch (error: unknown) {
      console.error('Error sending batch messages:', error);
      throw error;
    }
  }
}

export default new KafkaProducerService();
