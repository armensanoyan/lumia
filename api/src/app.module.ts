import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './query/query.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [QueryModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
