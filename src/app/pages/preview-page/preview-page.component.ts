import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.scss']
})
export class PreviewPageComponent {

  constructor(private commonService: CommonService) {
    this.commonService.setLoading(false);
  }
}
