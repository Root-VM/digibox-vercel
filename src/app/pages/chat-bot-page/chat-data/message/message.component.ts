import {Component, Input} from '@angular/core';
import {MessageType} from "./message-type";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent {
  @Input() data: MessageType;

  constructor() {
    // default data
    this.data = {
      title: '',
      text: '',
      type: 'bot'
    }
  }
}
