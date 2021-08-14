export type Message = {
  conversationId?: string,
  messageId: string,
  toProfileId: string,
  fromProfileId: string,
  body: string,
  read: boolean,
};
