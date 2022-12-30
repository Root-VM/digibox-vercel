import {Component, Input, OnInit} from '@angular/core';
import {MessageType} from "./message-type";
import {fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation} from "angular-animations";

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
  showPointsAnimation = true;

  constructor() {
    // default data
    this.data = {
      title: '',
      text: '',
      type: 'bot'
    }
  }

  ngOnInit() {
    if(this.data.type === "bot") {
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

    if(this.data.type === 'user') {
      // scrolling to bottom of chat then user load
      setTimeout(() => this.scrollBottom(), 450)
    }
  }

  scrollBottom() {
    const chat_el = document.getElementsByTagName('app-chat-data')[0];
    if(chat_el) {
      chat_el.scrollTop = chat_el.scrollHeight;
    }
  }

}
