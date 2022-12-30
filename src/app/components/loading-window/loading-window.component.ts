import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-loading-window',
  templateUrl: './loading-window.component.html',
  styleUrls: ['./loading-window.component.scss']
})
export class LoadingWindowComponent {

  constructor(public commonService: CommonService) {
  }
}
