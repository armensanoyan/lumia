import * as dotenv from 'dotenv';
import { join } from 'path';
import { validateEnv } from './utils/validateEnv';

dotenv.config({ path: join(__dirname, '../../.env') });
validateEnv();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import MongoClient from './storages/mongodb';
import KafkaProducerService from './services/kafka';
import { kafkaConfig } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await Promise.all([MongoClient.connect(), KafkaProducerService.connect()]);
  await KafkaProducerService.listen(kafkaConfig.topic);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
