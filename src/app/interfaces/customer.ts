
export interface CustomerInterface {
  email: string;
  data: string;
}

export interface CustomerProgressInterface {
  id: number;
  answer_id: number;
  next_id?: number;
  data?: string;
  type: 'bot' | 'bot-q' | 'bot_default' | 'user' | 'user-q' | 'title' | 'subtitle';
  text: string
  step?: number
}
