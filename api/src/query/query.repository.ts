import { Collection, InsertOneResult } from 'mongodb';
import MongoClient from '../storages/mongodb';
import { SearchDto } from './dto/search.dto';
import { SearchResultDto } from './dto/search-results.dto';

export class QueryRepository {
  private readonly collection: Collection;
  constructor() {
    this.collection = MongoClient.getCollection('queries');
  }

  async findByTitle(searchDto: SearchDto): Promise<SearchResultDto[]> {
    const { title, limit = 10, offset = 0 } = searchDto;

    return await this.collection
      .find<SearchResultDto>({ title }) // TODO: partial match on title
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  async addQuery(searchDto: SearchDto): Promise<InsertOneResult<Document>> {
    return this.collection.insertOne(searchDto);
  }
}
