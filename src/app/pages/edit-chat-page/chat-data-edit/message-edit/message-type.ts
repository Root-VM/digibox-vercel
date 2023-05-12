export type MessageType = {
  step?: any;
  title?: string;
  text: string;
  text_pdf?: string;
  type?: 'bot' | 'bot-q' | 'user' | 'user-q' | 'bot-loading' | 'title' | 'subtitle' | 'bot_default',
  id?: string;
  next_id?: number;
}
