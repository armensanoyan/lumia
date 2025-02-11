import * as dotenv from 'dotenv';
import { join } from 'path';
import { validateEnv } from './utils/validateEnv';

dotenv.config({ path: join(__dirname, '../../.env') });
validateEnv();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import MongoClient from './storages/mongodb';
import RedisClient from './storages/redis';
import KafkaProducerService from './services/kafka';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    await Promise.all([
      MongoClient.connect(),
      RedisClient.connect(),
      KafkaProducerService.connect(),
    ]);

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('StackOverflow API')
      .setDescription('API for StackOverflow')
      .setVersion('1.0')
      .addTag('StackOverflow')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    // Add graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, () => {
        // Handle shutdown with timeout
        const shutdownTimeout = setTimeout(() => {
          console.error('Shutdown timed out after 5000ms, forcing exit');
          process.exit(1);
        }, 5000);

        Promise.all([
          MongoClient.disconnect(),
          RedisClient.disconnect(),
          KafkaProducerService.disconnect(),
        ])
          .then(() => app.close())
          .then(() => {
            clearTimeout(shutdownTimeout);
            process.exit(0);
          })
          .catch((err) => {
            clearTimeout(shutdownTimeout);
            console.error('Error during shutdown:', err);
            process.exit(1);
          });
      });
    });

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error connecting to MongoDB, Redis, and Kafka:', error);
    await Promise.all([
      MongoClient.disconnect(),
      RedisClient.disconnect(),
      KafkaProducerService.disconnect(),
    ]);
    process.exit(1);
  }
}

bootstrap();
