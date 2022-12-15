import {Component, Input} from '@angular/core';
import {ParagraphType} from "./paragraph-types";

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss']
})
export class ParagraphComponent {
  @Input() data: ParagraphType;

  constructor() {
    // default data
    this.data = {
      text: '',
      type: 'paragraph'
    }
  }
}
