import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {ChatDataService} from "../../../services/chat-data.service";
import {Router} from "@angular/router";
import {ChatDataInterface} from "../../../interfaces/chat";
import {CustomerProgressInterface} from "../../../interfaces/customer";
import {loadFromStore} from "../../../methods/locale-store";
import {CommonService} from "../../../services/common.service";

@Component({
  selector: 'app-preview-data-link',
  templateUrl: './preview-data-link.component.html',
  styleUrls: ['./preview-data-link.component.scss']
})
export class PreviewDataLinkComponent implements OnInit, OnDestroy{
  progress: Array<any> = [];
  userData: Array<any> = [];
  subscription : Subscription = new Subscription();
  fullName = '';
  email = '';
  address = '';
  active = false;

  constructor(
    private customerService: CustomerService,
    private chatDataService: ChatDataService,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.chatDataService.getChatData().then(() => {});
  }

  ngOnInit() {
    const has_chat = loadFromStore('chat_data');

    combineLatest(
      this.customerService.customerProgress$,
      this.chatDataService.chatData$
    ).subscribe(([progress, data]) => {
      this.commonService.setLoading(true);

      if(!has_chat && !data.length) {
        setTimeout(() => location.reload(), 1000)
      }

      if(progress?.length && data?.length) {
        this.commonService.setLoading(false);
        let user_data: Array<any> = [];

        for(let el of progress) {
          const data_el = data.find(v => el.id === v.id);

          if(!data_el?.hide_for_pdf ) {
            user_data.push({custom: !!data_el?.is_personal_data_style, ...el});
          }
        }

        user_data = user_data.map(v => {
          let id = v.id;
          if(String(id).length > 2) {
            id = Number(String(id).substring(0, 2));
          }

          return {...v, step: Math.floor(Number(v.step)), step_origin: v.step, id}
        }).reduce(function (r, a) {
          r[a.step_origin] = r[a.step_origin] || [];
          r[a.step_origin].push(a);
          return r;
        }, Object.create(null));

        user_data = Object.values(user_data);


        user_data = user_data.map(v => {

          const grouped = v.reduce((result: any, currentValue: any) => {
            let groupValue = currentValue.id;
            if (!result[groupValue]) {
              result[groupValue] = [];
            }
            result[groupValue].push(currentValue);
            return result;
          }, {});

          Object.values(grouped).forEach((group: any) => {
            group.sort((a: any, b: any) => a.step_origin - b.step_origin);
          });

          return Object.values(grouped);
        });


        if(!user_data?.length) {
          setTimeout(() => location.reload(), 1000);
          return;
        }
        user_data = user_data.sort((a, b) => a[0][0].step - b[0][0].step);

        this.progress = user_data.slice(0, -1);
        this.userData = user_data[user_data.length - 1][0];

        this.fullName = this.getFullName(data, progress);
        this.email = this.getEmail(data, progress);
        this.address = this.getAddress(data, progress);

        const store = loadFromStore('customer_progress');
        if(store.length ) {
          this.customerService.postUnfinishedCustomerApi(
            this.email, {
              data: store,
              status: 'paid',
              full_name: this.fullName,
              email: this.email
            }
          ).then();
        }

        if(!this.fullName) {
          if(!has_chat && !data.length) {
            setTimeout(() => location.reload(), 1000)
          }
        }
      }
    })
  }

  getFullName(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    const ids = data?.filter(val => val.is_personal_data)

    const find_name = progress.find(el => el.answer_id === ids[0].person_identifying[0].id)
    const last_name = progress.find(el => el.answer_id === ids[0].person_identifying[1].id)

    return find_name?.text ? `${find_name?.text} ${last_name?.text}` : '';
  }

  getEmail(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    const ids = data?.filter(val => val.is_personal_data)
    const val = ids[0].person_identifying.find(el => el.control_text === 'E-Mail-Adresse')
    const email = progress.find(el => el.answer_id === val?.id)

    return email?.text ? email?.text : '';
  }

  getAddress(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    const ids = data?.filter(val => val.is_personal_data)
    const val = ids[0].person_identifying.find(el => el.control_text === 'Strasse und Nr.')
    const address = progress.find(el => el.answer_id === val?.id)

    return address?.text ? address?.text : '';
  }

  async toEdit(id:string, step: string) {
    let progress = String(id);

    if(progress.length > 2) {
      progress = progress.substring(0, 2);
    }

    await this.router.navigate(['chat-edit'], {
      queryParamsHandling: 'merge',
      queryParams: { progress, step, editLink: 'true' }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
