import { Component } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wrong-email-page',
  templateUrl: './wrong-email-page.component.html',
  styleUrls: ['./wrong-email-page.component.scss']
})
export class WrongEmailPageComponent {
  constructor(private commonService: CommonService, private router: Router) {
    this.commonService.setLoading(false);
    localStorage.clear();
  }

  async goBack() {
    window.location.href = '/chat-bot';
  }
}
