export type MessageType = {
  title?: string;
  text: string;
  type?: 'bot' | 'user' | 'bot-loading',
  id?: string;
}
