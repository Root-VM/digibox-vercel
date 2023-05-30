import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wrong-payment-page',
  templateUrl: './wrong-payment-page.component.html',
  styleUrls: ['./wrong-payment-page.component.scss']
})
export class WrongPaymentPageComponent {
  constructor(private commonService: CommonService, private router: Router) {
    this.commonService.setLoading(false);
    // localStorage.clear();
  }

  async toSubscribe() {
    await this.router.navigate(['/subscribe']);
  }
}
