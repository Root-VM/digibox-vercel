
export interface CustomerInterface {
  email: string;
  data: string;
  payment_id: string
}

export interface CustomerProgressInterface {
  id: number;
  answer_id: number;
  next_id?: number;
  data?: string;
  type: 'bot' | 'bot-q' | 'bot_default' | 'user' | 'user-q' | 'title' | 'subtitle';
  text: string;
  clear_text: string;
  text_pdf: string;
  step?: number;
  is_multiple?: boolean;
}
