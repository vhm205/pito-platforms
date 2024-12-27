export class AutocompleteFeedDocument {
  id: string;
  term: string;
  is_active: boolean;
  entity_type: string;
}

export class AutocompleteFeedResponse {
  id: string;
  label: string;
  highlight: string;
  entity_type: string;
}
