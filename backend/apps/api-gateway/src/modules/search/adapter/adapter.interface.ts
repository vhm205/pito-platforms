import { AutocompleteFeedDocument, AutocompleteFeedResponse } from '../domain/autocomplete.domain';
import { AutocompleteFeedSyncAction } from '../enum';

export abstract class SearchAdapter {
  abstract searchAutocompleteFeed(
    query: string,
    limit: number,
  ): Promise<AutocompleteFeedResponse[]>;
  abstract syncAutocompleteFeed(
    docs: AutocompleteFeedDocument[],
    action: AutocompleteFeedSyncAction,
  ): Promise<void>;
}
