import { Component } from '@angular/core';
import {MessageType} from "./message/message-type";
import {ParagraphType} from "./paragraph/paragraph-types";

@Component({
  selector: 'app-chat-data',
  templateUrl: './chat-data.component.html',
  styleUrls: ['./chat-data.component.scss']
})
export class ChatDataComponent {
  messageData: Array<MessageType | ParagraphType> = [
    {
      title: 'Title',
      text: 'some data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data text',
      type: 'bot'
    },
    {
      text: 'lorem asdasd',
      type: 'paragraph'
    },
    {
      text: 'some data text',
      type: 'user'
    },
    {
      text: 'textsome data textsome data textsome data textsome data textsome data textsome data text',
      type: 'bot'
    },
    {
      title: 'Title',
      text: 'Message',
      type: 'bot'
    },
    {
      text: 'some data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome data textsome d',
      type: 'user'
    },
    {
      text: '',
      type: 'bot-loading'
    },
  ]

  paragraphItem(object: any):ParagraphType {
    return object as ParagraphType;
  }
  messageItem(object: any):MessageType {
    return object as MessageType;
  }
}
