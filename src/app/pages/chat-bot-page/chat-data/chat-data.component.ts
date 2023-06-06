import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MessageType} from "./message/message-type";
import {ChatDataInterface} from "../../../interfaces/chat";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {ChatDataService} from "../../../services/chat-data.service";
import {CommonService} from "../../../services/common.service";

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
    private chatService: ChatDataService,
    private commonService: CommonService
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

      this.messageData = data;

      // redirect if chat finished
      const last_el = this.data[this.data.length - 1];
      const answered_last = data.find((el: any) => el?.step === last_el?.step);

      if(answered_last?.id && data[data.length - 1]?.type === 'user') {
        this.commonService.setLoading(true);
        const email = data.find((el: any) => el?.answer_id === 140)?.text;

        if(email) {
          this.customerService.checkPaymentDataApi(email).then( async data => {
            await this.router.navigate(data ? ['/wrong-email'] : ['/preview']);
          });
        }

        this.commonService.setLoading(false);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  async generateChatDataByRoute () {
    const progress_query = Number(this.route.snapshot.queryParams?.['progress']);
    const bot_el = this.data.find(el => el.id === Number(progress_query));

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
