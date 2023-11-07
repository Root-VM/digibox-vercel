import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {CustomerService} from "../../services/customer.service";
import {environment} from "../../../environments/environment";
import {getProductStripeApi, SS_ProductCheckout} from "../../methods/stripe";
import {ChatDataService} from "../../services/chat-data.service";
import {combineLatest} from "rxjs";
import {ChatDataInterface} from "../../interfaces/chat";
import {CustomerProgressInterface} from "../../interfaces/customer";

@Component({
  selector: 'app-subscribe-page',
  templateUrl: './subscribe-page.component.html',
  styleUrls: ['./subscribe-page.component.scss']
})
export class SubscribePageComponent implements OnInit {
  apiUrl = environment.API_URL;
  email = '';
  productPrice = 0;
  isChecked= false;
  touched= false;

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService,
    private chatDataService: ChatDataService
  ) {}

  async ngOnInit() {
    try {
      const product = await getProductStripeApi();
      this.commonService.setLoading(false);

      if(product?.price) {
        this.productPrice = product.price;
      }
    } catch (e) {
      this.commonService.setLoading(false);
    }

    combineLatest(
      this.customerService.customerProgress$,
      this.chatDataService.chatData$
    ).subscribe(([progress, data]) => {
      if(progress?.length && data?.length) {
        const get_email = (data: ChatDataInterface[] | [], progress: CustomerProgressInterface[] | []) => {
          const ids = data?.filter(val => val.is_personal_data)
          const val = ids[0].person_identifying.find(el => el.control_text === 'E-Mail-Adresse')
          const email = progress.find(el => el.answer_id === val?.id)

          return email?.text ? email?.text : '';
        }

        this.email = get_email(data, progress);
      }
    })
  }

  toggle(e: any) {
    this.isChecked = e;
    this.touched = true;
  }
  subscribe() {
    this.touched = true;
    this.isChecked && SS_ProductCheckout( this.apiUrl, this.email);
  }

}
