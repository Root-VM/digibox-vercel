import {Component, Input} from '@angular/core';
import {ChatDataService} from "../../services/chat-data.service";
import {MessageExplanationInterface} from "../../interfaces/chat";

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent{
  @Input() showHeader = true;
  explanationList: MessageExplanationInterface[] = [];

  constructor(private chatService: ChatDataService) {
    chatService.explanationData$.subscribe(data => this.explanationList = data)
  }

}
