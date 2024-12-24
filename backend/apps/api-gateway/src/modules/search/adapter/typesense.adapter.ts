import { LoggerService } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'lodash';
import Typesense, { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { AutocompleteFeedDocument, AutocompleteFeedResponse } from '../domain/autocomplete.domain';
import { AutocompleteFeedSyncAction } from '../enum';

import { SearchAdapter } from './adapter.interface';

const CollectionName = {
  AUTOCOMPLETE_FEED: 'autocompleteFeed',
  SEARCH_FEED: 'searchFeed',
};

@Injectable()
export class TypesenseAdapter implements SearchAdapter {
  private readonly typesenseClient: Client;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    this.typesenseClient = new Typesense.Client({
      nodes: [
        {
          host: this.configService.get('app.typesense.host', { infer: true })!,
          port: this.configService.get('app.typesense.port', { infer: true })!,
          protocol: this.configService.get('app.typesense.protocol', { infer: true })!,
        },
      ],
      apiKey: this.configService.get('app.typesense.apiKey', { infer: true })!,
      connectionTimeoutSeconds: this.configService.get('app.typesense.connectionTimeoutSeconds', {
        infer: true,
      })!,
    });

    this.typesenseClient.health.retrieve().catch(e => {
      const error = e as Error;
      this.logger.error(`Failed to connect to Typesense ==> ${error.message}`, {
        context: TypesenseAdapter.name,
        trace: error.stack,
      });
    });
  }

  protected toNDJSON<T>(docs: T | T[]) {
    if (!Array.isArray(docs)) docs = [docs];
    return docs.map(doc => JSON.stringify(doc)).join('\n');
  }

  protected toJSON<T>(ndjson: string): T[] {
    return ndjson.split('\n').map(line => JSON.parse(line));
  }

  protected createCollection(schema: CollectionCreateSchema) {
    return this.typesenseClient.collections().create(schema);
  }

  async searchAutocompleteFeed(query: string, limit: number): Promise<AutocompleteFeedResponse[]> {
    try {
      const docs = await this.typesenseClient
        .collections<AutocompleteFeedDocument>(CollectionName.AUTOCOMPLETE_FEED)
        .documents()
        .search({
          q: query,
          per_page: limit,
          query_by: 'term', // search by term field
          filter_by: 'is_active:true', // filter by is_active field
          use_cache: true,
        });

      return map(docs.hits, ({ document, highlight }) => ({
        id: document.id,
        label: document.term,
        highlight: highlight.term?.value ?? document.term,
        entity_type: document.entity_type,
      }));
    } catch (e) {
      const error = e as Error;
      this.logger.error(`Failed to search autocomplete feed: ${error.message}`, {
        context: TypesenseAdapter.name,
        trace: error.stack,
      });
      return []; // return empty array if error
    }
  }

  protected createAutocompleteFeedCollection() {
    return this.createCollection({
      name: CollectionName.AUTOCOMPLETE_FEED,
      fields: [
        { name: 'id', type: 'string' },
        { name: 'term', type: 'string' },
        { name: 'is_active', type: 'bool' },
        { name: 'entity_type', type: 'string' },
      ],
    });
  }

  async syncAutocompleteFeed(docs: AutocompleteFeedDocument[], action: AutocompleteFeedSyncAction) {
    const isCollectionExists = await this.typesenseClient
      .collections<AutocompleteFeedDocument>(CollectionName.AUTOCOMPLETE_FEED)
      .exists();

    if (!isCollectionExists) {
      try {
        await this.createAutocompleteFeedCollection();
        this.logger.log('Autocomplete feed collection created', {
          context: TypesenseAdapter.name,
        });
      } catch (e) {
        const error = e as Error;
        this.logger.error(`Failed to create autocomplete feed collection: ${error.message}`, {
          context: TypesenseAdapter.name,
          trace: error.stack,
        });
        throw e;
      }
    }

    switch (action) {
      case AutocompleteFeedSyncAction.DELETE:
        await Promise.all(
          docs.map(doc =>
            this.typesenseClient
              .collections(CollectionName.AUTOCOMPLETE_FEED)
              .documents(doc.id)
              .delete(),
          ),
        );
        break;
      default:
        const documents = this.toNDJSON(docs);
        await this.typesenseClient
          .collections(CollectionName.AUTOCOMPLETE_FEED)
          .documents()
          .import(documents, { action });
    }
  }
}
