import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MessageType} from "./message/message-type";
import {ParagraphType} from "./paragraph/paragraph-types";
import {ChatDataInterface} from "../../../interfaces/chat";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {progressUrlDecode} from "../../../methods/progress-url-decode";

@Component({
  selector: 'app-chat-data',
  templateUrl: './chat-data.component.html',
  styleUrls: ['./chat-data.component.scss']
})
export class ChatDataComponent implements OnInit, OnDestroy{
  @Input() data: ChatDataInterface[] | [] = [];
  paramsSubscription : Subscription = new Subscription();
  messageData: Array<MessageType | ParagraphType> = [];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.route.queryParams.subscribe(() => this.generateChatData());
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async generateChatData() {
    const progress_query = this.route.snapshot.queryParams?.['progress'];

    if(progress_query) {
      const decode = progressUrlDecode(progress_query);

      if(decode?.length) {
        const chat: Array<MessageType | ParagraphType> = [];

        for(let val of decode) {
         const bot_el = this.data.find(el => el.id === val.bot);
         const user_el = bot_el?.answers.find(el => el.id === val.user);
         const next_bot_el_id = user_el && user_el.next_step?.data?.id;
         let next_bot_el;

         if(next_bot_el_id) {
           next_bot_el = this.data.find(el => el.id === next_bot_el_id);
         }

         !chat.length && chat.push({ type:'bot', text: bot_el?.bot_default_message ? bot_el?.bot_default_message : '',
           id: bot_el?.id ? String(bot_el?.id) + 'b': undefined});

         chat.push(
           { type:'user', text: user_el?.user_message ? user_el?.user_message : '', id: val.id + 'u'},
           { type:'bot', text: user_el?.bot_message ? user_el?.bot_message : '', id: val.id + 'bu'},
           { type:'bot', text: next_bot_el?.bot_default_message ? next_bot_el?.bot_default_message : '', id: val.id + 'b'},
         )
        }

        // pushing for render
        for (let i in chat) {
          let have_in_message;

          if(Number(i) < 1 ) {
            have_in_message = this.messageData.find(m => chat[i].text === m.text);
          } else {
            have_in_message = this.messageData.find(m => chat[i].id === m.id);
          }
          !have_in_message && this.messageData.push(chat[i]);
        }

        // this.messageData = chat;
      }
    } else {
      const init_message = this.data?.find(value => value.bot_default_message);
      this.messageData = [{ type:'bot', text: init_message?.bot_default_message ? init_message?.bot_default_message : ''}];
    }
  }

  paragraphItem(object: any):ParagraphType {
    return object as ParagraphType;
  }
  messageItem(object: any):MessageType {
    return object as MessageType;
  }
}
