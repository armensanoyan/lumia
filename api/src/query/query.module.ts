import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { QueryRepository } from './query.repository';

@Module({
  controllers: [QueryController],
  providers: [QueryService, QueryRepository],
})
export class QueryModule {}
