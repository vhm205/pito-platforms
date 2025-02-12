interface MessageSection {
  type: string;
  text: string;
}

export interface SlackMessage {
  text?: string | MessageSection;
  blocks?: Array<{
    type: string;
    text: MessageSection;
  }>;
}
