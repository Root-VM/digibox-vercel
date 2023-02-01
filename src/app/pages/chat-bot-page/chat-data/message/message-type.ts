export type MessageType = {
  title?: string;
  text: string;
  type?: 'bot' | 'bot-q' | 'user' | 'user-q' | 'bot-loading' | 'title' | 'subtitle' | 'bot_default',
  id?: string;
  next_id?: number;
}
