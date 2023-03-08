import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {ChatDataService} from "../../../services/chat-data.service";
import {ChatDataInterface} from "../../../interfaces/chat";
import {CustomerProgressInterface} from "../../../interfaces/customer";

@Component({
  selector: 'app-preview-data',
  templateUrl: './preview-data.component.html',
  styleUrls: ['./preview-data.component.scss']
})
export class PreviewDataComponent implements OnInit, OnDestroy {
  progress: Array<any> = [];
  userData: Array<any> = [];
  subscription : Subscription = new Subscription();
  fullName = '';
  email = '';

  constructor(
    private customerService: CustomerService,
    private chatDataService: ChatDataService,
  ) { chatDataService.getChatData().then(); }

  ngOnInit() {
    combineLatest(
      this.customerService.customerProgress$,
      this.chatDataService.chatData$
    ).subscribe(([progress, data]) => {
      console.log(2, data)
      if(progress?.length && data?.length) {
        let user_data: Array<any> = [];

        for(let el of progress) {
          const data_el = data.find(v => el.id === v.id);

          if(!data_el?.hide_for_pdf) {
            user_data.push(el);
          }
        }

        // this.progress = user_data;
        user_data = user_data.map(v => {
          return {...v, step: Math.floor(Number(v.step))}
        }).reduce(function (r, a) {
          r[a.step] = r[a.step] || [];
          r[a.step].push(a);
          return r;
        }, Object.create(null));

        user_data = Object.values(user_data);

        this.progress = user_data.slice(0, -1);
        this.userData = user_data[user_data.length - 1];

        this.fullName = this.getFullName(data, progress);
        this.email = this.getEmail(data, progress);
      }
    })
  }

  getFullName(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    let name = '';
    const ids = data?.filter(val => val.is_personal_data && val?.answers[0]?.control_text !== 'E-Mailadresse')
      ?.map(val => val.answers[0].id);

    for(let id of ids) {
      const el = progress.find(val => val.answer_id === id)
      if(el?.text) {
        name += el.text + ' '
      }
    }

    return name;
  }

  getEmail(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    let result = '';
    const item = data?.find(val => val.is_personal_data && val?.answers[0]?.control_text === 'E-Mailadresse');

    if(item) {
      const el = progress.find(val => val.answer_id === item.answers[0].id)

      el?.text && (result = el?.text);
    }

    return result;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
