import {Component, Input, OnInit} from '@angular/core';
import {MessageType} from "./message-type";
import {fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation} from "angular-animations";
import {ChatDataInterface, MessageExplanationInterface} from "../../../../interfaces/chat";
import {ChatDataService} from "../../../../services/chat-data.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({duration: 300, delay: 400}),
    fadeInRightOnEnterAnimation({duration: 300})
  ]
})

export class MessageComponent implements OnInit {
  @Input() data: MessageType;
  @Input() list: ChatDataInterface[] | [] = [];
  @Input() showPointsAnimation = true;
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
    if(this.data.type === "bot" || this.data.type === "bot-q" || this.data.type === "bot_default") {
      // scrolling to bottom of chat then bot load
      setTimeout(() => this.scrollBottom(), 450)

      setTimeout(() => {
        this.showPointsAnimation = false;

        // scrolling to bottom of chat after text load
        setTimeout(() => {
          this.scrollBottom();
        }, 100)
      }, 1500);
    }

    if(this.data.type === 'user' || this.data.type === 'user-q') {
      // scrolling to bottom of chat then user load
      setTimeout(() => this.scrollBottom(), 450)
    }


    // check explanation
    if(this.data && this.data?.type === 'bot_default' && this.list?.length) {
      const exp_el = this.list.find(el => el.id === Number(this.data.id))

      if(exp_el?.bot_message_explanation) {
        this.explanation = exp_el.bot_message_explanation
      }
    }
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
