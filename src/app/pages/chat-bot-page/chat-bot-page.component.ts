import {Component, OnInit} from '@angular/core';
import {ChatDataService} from "../../services/chat-data.service";
import {ChatDataInterface} from "../../interfaces/chat";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-chat-bot-page',
  templateUrl: './chat-bot-page.component.html',
  styleUrls: ['./chat-bot-page.component.scss']
})
export class ChatBotPageComponent implements OnInit {
  data: ChatDataInterface[] | [] = [];

  constructor(
    private chatDataService: ChatDataService,
    private commonService: CommonService
  ) {
    chatDataService.getChatData().then();
  }

  ngOnInit() {
    this.chatDataService.chatData$.subscribe(async val => {
      if(val?.length) {
        this.data = val;
        this.commonService.setLoading(false);
      }
    });
  }
}
