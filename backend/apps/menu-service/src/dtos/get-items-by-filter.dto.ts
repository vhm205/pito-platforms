import { PartnerItem } from '../domain/partner-item.domain';

export class FindItemsByFiltersResult {
  items: Array<
    PartnerItem & {
      store: {
        status: string;
        reopenTime?: string | undefined;
        prepTimes: { [key: string]: any } | undefined;
      };
    }
  >;
  total: number;
}
