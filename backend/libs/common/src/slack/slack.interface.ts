interface MessageSection {
  type: string;
  text: string;
}

export interface BlockSection {
  type: string;
  text: MessageSection;
}

export interface SlackMessage {
  text?: string | MessageSection;
  blocks?: Array<BlockSection>;
}
