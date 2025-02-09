import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import MongoClient from './storages/mongodb';
import RedisClient from './storages/redis';
import KafkaProducerService from './services/kafka';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await MongoClient.connect();
  await RedisClient.connect();
  await KafkaProducerService.connect();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Add graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      // Handle shutdown synchronously
      MongoClient.disconnect()
        .then(() => RedisClient.disconnect())
        .then(() => KafkaProducerService.disconnect())
        .then(() => app.close())
        .then(() => process.exit(0))
        .catch((err) => {
          console.error('Error during shutdown:', err);
          process.exit(1);
        });
    });
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
