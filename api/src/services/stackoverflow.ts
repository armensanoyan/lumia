import fetch, { Response } from 'node-fetch';
import { stackOverFlowConfig } from '../config/config';
import { SearchResultDto } from '../query/dto/search-results.dto';
import { SearchDto } from '../query/dto/search.dto';

const { site, order, sort } = stackOverFlowConfig;
interface StackOverflowResponse {
  items: SearchResultDto[];
}

export async function searchByTitleAndTags({
  title,
  tags,
  limit = 10,
  offset = 0,
}: SearchDto): Promise<SearchResultDto[]> {
  const params = new URLSearchParams({
    order,
    sort,
    intitle: title,
    site,
    pagesize: limit.toString(),
    page: (offset + 1).toString(),
  });

  if (tags?.length > 0) {
    params.append('tagged', tags.join(';'));
  }

  const url = `${stackOverFlowConfig.url}?${params.toString()}`;

  try {
    const response: Response = await fetch(url);
    if (!response?.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as StackOverflowResponse;
    return data.items;
  } catch (error: unknown) {
    console.log(
      'Error fetching data:',
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}
