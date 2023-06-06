import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SS_GetProductPaymentDetails} from "../../methods/stripe";
import {CustomerService} from "../../services/customer.service";

@Component({
  selector: 'app-success-payment-page',
  templateUrl: './success-payment-page.component.html',
  styleUrls: ['./success-payment-page.component.scss']
})
export class SuccessPaymentPageComponent implements OnInit{
  constructor(private commonService: CommonService,
              private router: Router,
              private _route: ActivatedRoute,
              private customerService: CustomerService
  ) {
    this.commonService.setLoading(false);
    // localStorage.clear();
  }

  ngOnInit () {
    this._route.queryParams
      .subscribe(async (params: any) => {
          const session = params?.sessionId;

          // if paid first time
          if(session) {
            const res = await SS_GetProductPaymentDetails(session);

            if(res.customer_email && (res.payment_status === 'paid' || res.payment_status === 'complete')) {
              this.customerService.sendEmailApi({
                email: res.customer_email,
                link: window.origin,
                stripe_id: res.subscription
              }).subscribe((el: any) => {
                localStorage.clear();
                this.commonService.setLoading(false);
              })
            }
          }

          // if edit
          if(params?.edited && params?.email) {
            const customers = await this.customerService.getCustomerByEmail(params.email);
            if(customers?.data[0]) {
              let status = customers?.data[0]?.attributes?.status;
              if(status === 'paid') {
                this.customerService.sendEmailApi({
                  email: params?.email,
                  link: window.origin,
                  stripe_id: customers?.data[0]?.attributes?.stripe_id
                }).subscribe((el: any) => {
                  localStorage.clear();
                  this.commonService.setLoading(false);
                })
              }
            }
          }

        }
      );
  }

  async toPreview() {
    await this.router.navigate(['/preview']);
  }
}
