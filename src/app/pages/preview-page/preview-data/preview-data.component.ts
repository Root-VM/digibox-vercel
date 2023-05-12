import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from "rxjs";
import {CustomerService} from "../../../services/customer.service";
import {ChatDataService} from "../../../services/chat-data.service";
import {ChatDataInterface} from "../../../interfaces/chat";
import {CustomerProgressInterface} from "../../../interfaces/customer";
import {Router} from "@angular/router";

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
  address = '';

  constructor(
    private customerService: CustomerService,
    private chatDataService: ChatDataService,
    private router: Router
  ) { chatDataService.getChatData().then(); }

  ngOnInit() {
    combineLatest(
      this.customerService.customerProgress$,
      this.chatDataService.chatData$
    ).subscribe(([progress, data]) => {
      if(progress?.length && data?.length) {
        let user_data: Array<any> = [];

        for(let el of progress) {
          const data_el = data.find(v => el.id === v.id);

          if(!data_el?.hide_for_pdf ) {
            user_data.push({custom: !!data_el?.is_personal_data_style, ...el});
          }
        }

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
        this.address = this.getAddress(data, progress);

        this.customerService.postCustomerDataApi(
          this.email,
          { personal: this.userData, progress: this.progress }
        ).then();
      }
    })
  }

  getFullName(data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) {
    const ids = data?.filter(val => val.is_personal_data)

    const find_name = progress.find(el => el.answer_id === ids[0].person_identifying[0].id)
    const last_name = progress.find(el => el.answer_id === ids[0].person_identifying[1].id)

    return `${find_name?.text} ${last_name?.text}`;
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
    await this.router.navigate(['chat-edit'], {
      queryParamsHandling: 'merge',
      queryParams: {
        progress: id,
        step: step
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
