export interface AnswerInterface {
  id: number;
  group_id?: number;
  control_text: string;
  control_type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input' | 'input-autocomplete';
  control_validation?: 'required' | 'email' | 'phone' | 'zip_code';
  validation_error_text: string;
  user_message: string;
  user_message_clear: string;
  user_pdf_message: string;
  bot_message: string;
  next_step: {data: {id: number}};
  autocomplete_data?: Array<string>;
  remove_next_on_edit?: number;
  add_next_on_edit?: number;
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
  bot_default_message_pdf: string;
  title: string;
  subtitle: string;
  bot_message_explanation: MessageExplanationInterface;
  answers: Array<AnswerInterface>;
  person_identifying: Array<AnswerInterface>;
  createdAt: string;
  updatedAt: string;
  hide_for_pdf: boolean;
  is_personal_data: boolean;
  is_personal_data_style: boolean;
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
  add_next_on_edit?: number;
  remove_next_on_edit?: number;
}

export interface ProgressInterface {
  chat_data: Array<{id: number, step: number}>;
  id: number;
  title: string;
  updatedAt: string;
  createdAt: string;
}
