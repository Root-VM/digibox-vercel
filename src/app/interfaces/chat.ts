export interface AnswerInterface {
  id: number;
  group_id?: number;
  control_text: string;
  control_type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input';
  control_validation?: 'required' | 'email' | 'phone' | 'zip_code';
  validation_error_text: string;
  user_message: string;
  bot_message: string;
  next_step: {data: {id: number}};
}

export interface MessageExplanationInterface {
  type: 'video' | 'text' | 'image';
  text: string;
  media: any;
}
export interface ChatDataInterface {
  id: number;
  step: number;
  bot_default_message: string;
  title: string;
  subtitle: string;
  bot_message_explanation: MessageExplanationInterface;
  answers: Array<AnswerInterface>;
  createdAt: string;
  updatedAt: string;
  group_of_message: {
    data: {
      attributes: {
        createdAt: string;
        title: string;
        updatedAt: string;
      }
    }
    id: number;
  }
}
