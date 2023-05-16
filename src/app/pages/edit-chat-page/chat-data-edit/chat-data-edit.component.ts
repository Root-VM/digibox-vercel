import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatDataInterface} from "../../../interfaces/chat";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {ChatDataService} from "../../../services/chat-data.service";
import {MessageType} from "./message-edit/message-type";

@Component({
  selector: 'app-chat-edit-data',
  templateUrl: './chat-data-edit.component.html',
  styleUrls: ['./chat-data-edit.component.scss']
})
export class ChatDataEditComponent implements OnInit, OnDestroy{
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

    this.subscription = this.customerService.customerProgress$.subscribe(async (data: any) => {
      const progress_query = Number(this.route.snapshot.queryParams?.['step']);

      this.messageData = data.filter((el: any) => Number(el.step) === progress_query);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  async generateChatDataByRoute () {
    const progress_query = Number(this.route.snapshot.queryParams?.['step']);
    const bot_el = this.data.find(el => Number(el.step) === Number(progress_query));

    bot_el?.title && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'title',
      text_pdf: '',
      text: bot_el.title,
      step: bot_el.step,
      // @ts-ignore
      add_next_on_edit: bot_el?.add_next_on_edit,
      remove_next_on_edit: bot_el?.remove_next_on_edit,
    });
    bot_el?.subtitle && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'subtitle',
      text_pdf: '',
      text: bot_el.subtitle,
      step: bot_el.step,
      // @ts-ignore
      add_next_on_edit: bot_el?.add_next_on_edit,
      remove_next_on_edit: bot_el?.remove_next_on_edit,
    });
    bot_el?.bot_default_message && this.customerService.setProgress({
      id: bot_el.id,
      answer_id: 0,
      next_id: 0,
      type: 'bot_default',
      text: bot_el.bot_default_message,
      text_pdf: bot_el.bot_default_message_pdf,
      step: bot_el.step,
      // @ts-ignore
      add_next_on_edit: bot_el?.add_next_on_edit,
      remove_next_on_edit: bot_el?.remove_next_on_edit,
    });
  }

  async navigationCheck() {
    const first_message_el = this.data[0];

    if(!this.messageData.length) {

      await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress: first_message_el.id,
          step: first_message_el.step
        },
      });
    } else if(!Number(this.route.snapshot.queryParams?.['progress'])){
      const last: any = this.messageData[this.messageData.length - 1];

      await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress:  last.id,
          step: last.step
        }
      });
    }
  }

  messageItem(object: any):MessageType {
    return object as MessageType;
  }
}
