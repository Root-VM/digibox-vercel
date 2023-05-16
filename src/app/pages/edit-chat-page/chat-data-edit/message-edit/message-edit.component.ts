import {Component, Input, OnInit} from '@angular/core';
import {MessageType} from "./message-type";
import {ChatDataInterface, MessageExplanationInterface} from "../../../../interfaces/chat";
import {ChatDataService} from "../../../../services/chat-data.service";

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.scss']
})

export class MessageEditComponent implements OnInit {
  @Input() data: MessageType;
  @Input() list: ChatDataInterface[] | [] = [];
  explanation: MessageExplanationInterface | null = null;

  constructor(private chatService: ChatDataService) {
    // default data
    this.data = {
      title: '',
      text: '',
      type: 'bot'
    }
  }

  ngOnInit() {
  }

  scrollBottom() {
    const chat_el = document.getElementsByTagName('app-chat-data')[0];
    if(chat_el) {
      chat_el.scrollTop = chat_el.scrollHeight;
    }
  }

  showExplanation () {
    this.explanation && this.chatService.addExplanation(this.explanation)
  }
}
