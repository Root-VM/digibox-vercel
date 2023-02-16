import {Component, Input} from '@angular/core';
import {MessageExplanationInterface} from "../../interfaces/chat";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-explanation-box',
  templateUrl: './explanation-box.component.html',
  styleUrls: ['./explanation-box.component.scss']
})
export class ExplanationBoxComponent {
  @Input() data: MessageExplanationInterface;
  apiUrl = environment.API_URL

  constructor() {
    this.data = {
      type: 'text',
      text: '',
      media: null
    }
  }

}
