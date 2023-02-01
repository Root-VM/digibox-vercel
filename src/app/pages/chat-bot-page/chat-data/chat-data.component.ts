import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MessageType} from "./message/message-type";
import {ChatDataInterface} from "../../../interfaces/chat";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {chatSort} from "../../../methods/chat-soring";
import {ChatDataService} from "../../../services/chat-data.service";

@Component({
  selector: 'app-chat-data',
  templateUrl: './chat-data.component.html',
  styleUrls: ['./chat-data.component.scss']
})
export class ChatDataComponent implements OnInit, OnDestroy{
  @Input() data: ChatDataInterface[] | [] = [];
  subscription : Subscription = new Subscription();
  subscription2 : Subscription = new Subscription();
  messageData: Array<MessageType> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private chatService: ChatDataService
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      await this.navigationCheck();
    });

    this.subscription2 = this.route.queryParams.subscribe(() => {
      this.generateChatDataByRoute();
      this.chatService.clearExplanations();
    });

    this.subscription = this.customerService.customerProgress$.subscribe((data: any) => {this.messageData = data});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  generateChatDataByRoute () {
    const progress_query = Number(this.route.snapshot.queryParams?.['progress']);
    const bot_el = this.data.find(el => el.id === Number(progress_query));

    bot_el?.title && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'title',
      text: bot_el.title,
      step: bot_el.step
    });
    bot_el?.subtitle && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'subtitle',
      text: bot_el.subtitle,
      step: bot_el.step
    });
    bot_el?.bot_default_message && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'bot_default',
      text: bot_el.bot_default_message,
      step: bot_el.step
    });
  }

  async navigationCheck() {
    const first_message_el = this.data[0];

    if(!this.messageData.length) {

      await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress: first_message_el.id
        },
      });
    } else if(!Number(this.route.snapshot.queryParams?.['progress'])){
      const last = this.messageData[this.messageData.length - 1];

      await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress:  last.id
        }
      });
    }
  }

  messageItem(object: any):MessageType {
    return object as MessageType;
  }
}
