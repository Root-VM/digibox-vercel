import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {CustomerService} from "../../services/customer.service";
import {environment} from "../../../environments/environment";
import {SS_ProductCheckout} from "../../methods/stripe";
import {ChatDataService} from "../../services/chat-data.service";
import {combineLatest} from "rxjs";
import {ChatDataInterface} from "../../interfaces/chat";
import {CustomerProgressInterface} from "../../interfaces/customer";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subscribe-page',
  templateUrl: './subscribe-page.component.html',
  styleUrls: ['./subscribe-page.component.scss']
})
export class SubscribePageComponent implements OnInit {
  apiUrl = environment.API_URL;
  email = '';

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService,
    private chatDataService: ChatDataService,
    private router: Router
  ) {
    this.commonService.setLoading(false);

  }

  ngOnInit() {
    combineLatest(
      this.customerService.customerProgress$,
      this.chatDataService.chatData$
    ).subscribe(([progress, data]) => {
      console.log(progress?.length && data?.length)
      if(progress?.length && data?.length) {
        const get_email = (data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) => {
          const ids = data?.filter(val => val.is_personal_data)
          const val = ids[0].person_identifying.find(el => el.control_text === 'E-Mail-Adresse')
          const email = progress.find(el => el.answer_id === val?.id)

          return email?.text ? email?.text : '';
        }

        this.email = get_email(data, progress);

        // this.customerService.checkPaymentDataApi(this.email).then( async data => {
        //   if(data) {
        //     await this.router.navigate(['/wrong-email']);
        //   }
        // })
      }
    })
  }

  subscribe() {
    SS_ProductCheckout(2, this.apiUrl, this.email);
  }


}
