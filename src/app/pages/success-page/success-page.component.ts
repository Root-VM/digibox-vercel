import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";
@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent {

  constructor(private commonService: CommonService) {
    this.commonService.setLoading(false);
    localStorage.clear();
  }
}
