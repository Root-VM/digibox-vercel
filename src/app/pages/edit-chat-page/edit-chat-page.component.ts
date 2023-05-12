import {Component, OnInit} from '@angular/core';
import {ChatDataService} from "../../services/chat-data.service";
import {CommonService} from "../../services/common.service";
import {ChatDataInterface} from "../../interfaces/chat";

@Component({
  selector: 'app-edit-chat-page',
  templateUrl: './edit-chat-page.component.html',
  styleUrls: ['./edit-chat-page.component.scss']
})
export class EditChatPageComponent implements OnInit{
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
